const express = require('express');
const {
  getAllAttendanceByUserId,
  getAllAreaByUserIdAndArea,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAllAttendanceByEventId
  } = require('../controller/attendance_controller');
  
  const {verifyToken} = require ('../middlewares/verifyToken')
  const router = express.Router();

  router.get('/api/getAllAttendanceByUserId',verifyToken, getAllAttendanceByUserId);
  router.get('/api/getAllAreaByUserIdAndArea',verifyToken, getAllAreaByUserIdAndArea);
  router.get('/api/getAllAttendanceByEventId',verifyToken, getAllAttendanceByEventId);
  router.post('/api/createAttendance',verifyToken, createAttendance);
  router.patch('/api/updateAttendance/:id',verifyToken, updateAttendance);
  router.delete('/api/deleteAttendance/:id',verifyToken, deleteAttendance);
  
  module.exports = router;