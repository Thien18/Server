const express = require('express');
const {
   
    register,
    login, 
    logout,
    registerOTP,
    confirmOtpRegisted,
    forgotPassword,
    resetPassword
} = require('../controller/Auth');

const router = express.Router();

router.post('/api/auth/register', register);
router.post('/api/auth/registerOTP', registerOTP);
router.post('/api/auth/confirmOtpRegisted', confirmOtpRegisted);

router.post('/api/auth/login', login);
router.post('/api/auth/logout', logout);

// router.post('/api/auth/logout', logout);
// router.post('/api/auth/refresh-token', refreshTokenCrl);
router.post('/api/auth/forgotpassword', forgotPassword)
router.post('/api/auth/resetPassword', resetPassword)

//router.post('/social-login', socialLogin, socialLoginUpdateInfo, createToken);

module.exports = router;