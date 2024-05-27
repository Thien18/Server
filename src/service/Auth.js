const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize({
    dialect: 'sqlite', // Sử dụng dialect là SQLite
    storage: process.env.DATABASE, // Đường dẫn đến file SQLite
  });

var initModels = require("../models/init-models");
const db = initModels(sequelize)
const Account = db.Account;
const User = db.Users;


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
//const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { log } = require('console');
const sendMail = require("../ultils/sendEmail");


const register= async ({ email, password, phone_number, name, address, gender }, res) => {
    try {
       
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = Date.now() + 2 * 60 * 1000;
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
        const id = uuidv4();

        // Tạo tài khoản với thông tin cơ bản và một số trường khác
        const [account, created] = await Account.findOrCreate({
            where: { email },
            defaults: {
                email,
                password: hashPassword,
                role_id: "2",
                phone_number,
                passwordResetExpires: resetExpires,
                otpCode: otp,
                // Thêm trạng thái mặc định là "Locked" tùy ý
                status: true,
            },
        });
        const genderstr = gender == 1 ? "Nam" : "Nữ";
        const [user, createdu] = await User.findOrCreate({
            where: { email },
            defaults: {
                id,
                email,
                name,
                address,
                gender : genderstr
            },
        });
        // Gửi email với mã OTP 
        /**SELECT * FROM Accounts
PRAGMA foreign_keys=off;
DELETE FROM Accounts WHERE email = 'thien2001@gmail.com'; */
        
        const status = created && createdu ? 200 : 201;
        return res.status(status).json({
            message: created && createdu ? "Register successfully" : "Register fail",
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const registerAndSendOTP = async ({ email, password, phone_number, name, address, gender}, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = Date.now() + 2 * 60 * 1000;
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
        const id = uuidv4();
        // Tạo tài khoản với thông tin cơ bản và một số trường khác
        const [account, created] = await Account.findOrCreate({
            where: { email },
            defaults: {
                email,
                password: hashPassword,
                role_id: "2",
                phone_number,
                passwordResetExpires: resetExpires,
                otpCode: otp,
                // Thêm trạng thái mặc định là "Locked" tùy ý
                status: false,
            },
        });
        const genderstr = gender == 1 ? "Nam" : "Nữ";
        const [user, createdu] = await User.findOrCreate({
            where: { email },
            defaults: {
                id,
                email,
                name,
                address,
                gender : genderstr
            },
        });
        // Gửi email với mã OTP
        const html = ` <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="display:block;font-size:1.9em;color: #FF6600;text-decoration:none;font-weight:600;text-align:center">EOS</a>
          </div>
          <p style="font-size:1.1em">Dear Customer </p>
          <p>Thank you for choosing Event Organization System. Please get the OTP below to registed account. This OTP will expire 5 minutes from now.</p>
          <h2 style="background: #FF6600;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />FotoFushion</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Event Organization System Inc</p>
            <p>254, Nguyen Van Linh Street, Thanh Khue District, Da Nang City</p>
            <p>Vietnam</p>
          </div>
        </div>
      </div>`;
        await sendMail({
            email,
            html,
            subject: `REGISTER AN ACCOUNT`,
        });
        const status = created ? 200 : 409;
        return res.status(status).json({
            message: created ? "Send to your email successfully" : "Email is used",
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Hàm xác nhận OTP và kích hoạt tài khoản
const confirmOTPAndActivateAccount = async ({ email, otp }, res) => {
    try {
        const account = await Account.findOne({ where: { email, otpCode: otp } });
        
        if (!account) {
            return res.status(401).json({ message: "Invalid OTP code" });
        }

        // Kiểm tra xác nhận và kích hoạt tài khoản
        if (account.status === false) {
            const currentTime = Date.now();
            if (account.passwordResetExpires && currentTime > account.passwordResetExpires) {
                return res.status(401).json({ message: "OTP has expired" });
            }
            // Thay đổi trạng thái thành "Active" nếu tài khoản đang ở trạng thái "Locked"
            account.status = true;
            await account.save();
            return res.status(200).json({ message: 'Account confirmed and activated successfully.' });
        } else {
            return res.status(200).json({ message: 'Account already confirmed and activated.' });
        }
    } catch (error) {
        console.error('Error during OTP confirmation:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
const login = async ({ email, password }, res) => {
    try {
        const account = await Account.findOne({
            where: { email },


            
        });
        if (!account.status === true) {
            return res.status(404).json({ message: "Account has been locked" });
        }
        if (!account) {
            return res.status(404).json({ message: "Email hasn't been registered" });
        }
        
        const role = await account.getRole();
        const isChecked = account && bcrypt.compareSync(password, account.password);
        
        if (!isChecked) {
            return res.status(401).json({ message: "Password was incorrect" });
        }

        const accessToken = jwt.sign({ email: account.email, roleCode: role.code }, process.env.JWT_SECRET, { expiresIn: "2d" });
        const refreshToken = jwt.sign({ email: account.email }, process.env.JWT_SECRET_REFRESH_TOKEN , { expiresIn: "7d" });
        //console.log(refreshToken);
        await account.update({refreshToken }, res);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: 'none' });

        return res.status(200).json({ message: "Login is successful", accessToken,role });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const refreshToken = async (refreshToken, res) => {
    try {
        let response, status;
        const account = await Account.findOne({
            where: { refreshToken: refreshToken }
        })
        const role = account && (await account.getRole());
        if (account) {
            jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, (error) => {
                if (error) {
                    return res.status(401).json({
                        message: "Refresh token has expired. Require login again",
                    });
                } else {
                    const accessToken = jwt.sign({ email: account.email, roleCode: role.code }, process.env.JWT_SECRET, { expiresIn: "5d" })
                    status = accessToken ? 200 : 500;
                    response = {
                        message: accessToken ? "Generate access token successfully" : "Fail to generate new access token. Let's try more time",
                        'newAccessToken': accessToken ? accessToken : null,
                    }
                }
            })
        }
        return res.status(status).json(response);
    } catch (error) {
        throw new Error(error);
    }
};

const logout = async (refreshToken, res) => {
    // Delete refresh token in db
    await Account.update({ refreshToken: '' }, {
        where: {
            refreshToken: refreshToken
        }
    })
    // Delete refresh token in cookie browser
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return {
        success: true,
        mes: 'Logout is done'
    }
}

const forgotPassword = async (email, res) => {
    try {
        const account = await Account.findOne({
            where: { email: email }
        })
        if (!account) {
            console.log(account);
            return res.status(404).json({
                message: "Email hasn't been registered"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = Date.now() + 5 * 60 * 1000;
        await Account.update({
            passwordResetExpires: resetExpires,
            otpCode: otp
        }, {
            where: { email: email }
        })

        const html = `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="display:block;font-size:1.9em;color: #FF6600;text-decoration:none;font-weight:600;text-align:center">EOS</a>
          </div>
          <p style="font-size:1.1em">Dear Customer </p>
          <p>Thank you for choosing Event Organization System. Please get the OTP below to reset your password. This OTP will expire 5 minutes from now.</p>
          <h2 style="background: #FF6600;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />EOS</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Event Organization System Inc</p>
            <p>254, Nguyen Van Linh Street, Thanh Khue District, Da Nang City</p>
            <p>Vietnam</p>
          </div>
        </div>
      </div>
    `
        const rs = await sendMail({
            email,
            html,
            subject: "FORGOT PASSWORD",
        });
        return res.status(200).json({
            message: "Send to your email successfully",
            
        });
    } catch (error) {
        throw new Error(error);
    }
};

const resetPassword = async ({ password, otp }, res) => {
    try {

        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
        
        const account = await Account.update({
            password: hashPassword,
            otpCode: null,
            passwordResetExpires: null,
        }, {
            where: { otpCode: otp, passwordResetExpires: { [Op.gt]: Date.now() } }
        })
        const status = account[0] === 1 ? 200 : 404;
        return res.status(status).json({
            message: account[0] === 1 ? "Reset password successfully" : "OTP code is incorrect or expired"
        });
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    register,
     login,
     logout,
    registerAndSendOTP,
    confirmOTPAndActivateAccount,
    // refreshToken,
    // logout,
    forgotPassword,
    resetPassword
};