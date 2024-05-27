const express = require('express');
const {
    getChartByUserIdQuanlityAttendance,
    getChartByEventIdQuanlityAttendanceArea
  } = require('../controller/chart');
  
  const {verifyToken} = require ('../middlewares/verifyToken')
  const router = express.Router();

  router.get('/api/getChartByUserIdQuanlityAttendance', verifyToken, getChartByUserIdQuanlityAttendance);
  router.get('/api/getChartByEventIdQuanlityAttendanceArea', verifyToken, getChartByEventIdQuanlityAttendanceArea);


  
  module.exports = router;