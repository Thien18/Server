const express = require('express');
const {
    getAllSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
  } = require('../controller/schedule_controller');
  
  const {verifyToken} = require ('../middlewares/verifyToken')
  const router = express.Router();

  router.get('/api/getAllSchedule', getAllSchedule);
  router.post('/api/createSchedule', createSchedule);
  router.patch('/api/updateSchedule/:id', updateSchedule);
  router.delete('/api/deleteSchedule/:id', deleteSchedule);
  router.get('/api/getScheduleById/:id', getScheduleById);
  
  module.exports = router;