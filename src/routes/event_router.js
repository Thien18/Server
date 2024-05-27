const express = require('express');
const {
   createEvent,
   chageStatus,
   getAllEventByEmail,
   updateEvent
   
} = require('../controller/event_controller');

const {verifyToken,

   isAdminSystem,} = require ('../middlewares/verifyToken')
const router = express.Router();

router.post('/api/createEvent', verifyToken, createEvent );
router.put('/api/chageStatus', verifyToken, chageStatus );
router.get('/api/getAllEventByEmail', verifyToken, getAllEventByEmail);
router.post('/api/updateEvent', verifyToken, updateEvent );

module.exports = router;