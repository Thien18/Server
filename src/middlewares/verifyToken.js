const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize({
    dialect: 'sqlite', // Sử dụng dialect là SQLite
    storage: process.env.DATABASE, // Đường dẫn đến file SQLite
  });
var initModels = require("../models/init-models");
const db = initModels(sequelize)
const Account = db.Account;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token)
        return res.status(401).json({
            err: 1,
            message: "Require authorization",
        });
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_SECRET , async (error, decode) => {
        if (error) {
            const isChecked = error instanceof jwt.TokenExpiredError
            if (!isChecked) {
                return res.status(401).json({
                    err: 1,
                    message: "Access Token invalid",
                });
            }
            // Check the expiration date of the access token
            if (isChecked) {
                return res.status(401).json({
                    err: 2,
                    message: "Access Token has expired",
                });
            }
        }
        const account = await Account.findOne({
            where: { email: decode.email },
            attributes: {
                exclude: ["password", "refreshToken"],
            },
        });
        req.account = account;
        next();
    });
};

const isAdminSystem = (async (req, res, next) => {

    if (req.account.role_id !='1') {
        return res.status(401).json({
            success: false,
            message: 'You are not the admin of this sytem',
        });
    } else {
        next();
    }
});



module.exports = {
    verifyToken,

    isAdminSystem,
};