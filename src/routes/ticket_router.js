const express = require('express');
const {
   createTicket,
   disableTicket,
   getAllTicket,
   getTicketByUserId,
   updateTicket,
   getTicketDetails,
   getTicketPayment

   
   
} = require('../controller//ticket_controller');

const {verifyToken,
   isAdminSystem,} = require ('../middlewares/verifyToken')
const router = express.Router();

router.post('/api/createTicket', verifyToken, createTicket );
router.post('/api/disableTicket', verifyToken, disableTicket );
router.get('/api/getAllTicket', verifyToken, getAllTicket );
router.get('/api/getTicketByUserId', verifyToken, getTicketByUserId );
router.get('/api/getTicketDetails', verifyToken, getTicketDetails );
router.get('/api/getTicketPayment', verifyToken, getTicketPayment );
router.post('/api/updateTicket', verifyToken, updateTicket );

module.exports = router;