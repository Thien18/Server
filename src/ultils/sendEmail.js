const nodemailer = require('nodemailer')

const sendMail = async ({ email, subject, html }) => {
    try {
        console.log(email);
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_APP_PASSWORD
            }
        });
        let info = await transporter.sendMail({
            from: '"Event Organization System" <no-relply-thien181201@gmail.com>',
            to: email,
            subject: subject,
            html: html
        });
        return info;
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;