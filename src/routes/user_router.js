const express = require('express');
const {
   getAllUser,
   lockedUser,
   unlockUser,
   upToAdmin,
   neftToUser,
   getUserbyEmail
   
} = require('../controller/user_controller');

const {verifyToken,

   isAdminSystem,} = require ('../middlewares/verifyToken')
const router = express.Router();

router.get('/api/getAllUser', verifyToken, isAdminSystem, getAllUser );
router.get('/api/getUserbyEmail', verifyToken, getUserbyEmail );
router.post('/api/lockUser', verifyToken, isAdminSystem, lockedUser);
router.post('/api/unlockUser', verifyToken, isAdminSystem, unlockUser);
router.post('/api/uptoAdmin', verifyToken, isAdminSystem, upToAdmin);
router.post('/api/neftAdmin', verifyToken, isAdminSystem, neftToUser);

module.exports = router;