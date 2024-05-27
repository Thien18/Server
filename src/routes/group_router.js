const express = require('express');
const {
    createGroup,
    updateGroup,
    deleteGroup,
    getAllGroupByUserId,
    addMember,
    deleteMember,
    getAllUserByGroupId
   
} = require('../controller/group_controller');

const {verifyToken,
   isAdminSystem,} = require ('../middlewares/verifyToken')
const router = express.Router();

router.post('/api/createGroup', verifyToken, createGroup );
router.put('/api/updateGroup', verifyToken, updateGroup );
router.delete('/api/deleteGroup', verifyToken, deleteGroup);
router.get('/api/getAllGroupByUserId', verifyToken, getAllGroupByUserId);
router.post('/api/addMember', verifyToken, addMember );
router.delete('/api/deleteMember', verifyToken, deleteMember);
router.get('/api/getAllUserByGroupId', verifyToken, getAllUserByGroupId);
module.exports = router;