const express = require('express');
const {
   createQR,
   getAllQRByEventId,
   getQRArea,
   getQREvent
   
} = require('../controller/qr_code_controller');

const {verifyToken,
   isAdminSystem,} = require ('../middlewares/verifyToken')
const router = express.Router();

router.post('/api/createQR', verifyToken, createQR );
router.get('/api/getAllQRByEventId', verifyToken, getAllQRByEventId);
router.get('/api/getQRArea', verifyToken, getQRArea);
router.get('/api/getQREvent', verifyToken, getQREvent);
module.exports = router;