const express = require('express');
const {
    createPayment,
    vnp_Return
   
} = require('../controller/payment_vnpay');

const {verifyToken,
   isAdminSystem,} = require ('../middlewares/verifyToken')
const router = express.Router();

router.post('/api/createPayment', verifyToken, createPayment );
router.get('/api/vnp_Return', vnp_Return );
module.exports = router;