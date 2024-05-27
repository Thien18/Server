const e = require('express');
const ChartService = require('../service/chart_service');
const joi = require("joi");
const getChartByUserIdQuanlityAttendance = async (req, res) =>{
    try{
    const user_id = req.query.user_id;
    const result = await ChartService.getChartByUserIdQuanlityAttendance(user_id);
    if(result){
        res.status(200).json(result);
    }  else{
        res.status(300).json({mesage: "Đã xãy ra lỗi khi lấy biểu đồ"});
    }
    }catch (err){
        console.log('loi khi xoá quyền admin: ',err);
        res.status(500).json({err: 'Đã xảy ra lỗi '})
    }
};
const getChartByEventIdQuanlityAttendanceArea = async (req, res) =>{
    try{
    const event_id = req.query.event_id;
    const result = await ChartService.getChartByEventIdQuanlityAttendanceArea(event_id);
    if(result){
        res.status(200).json(result);
    }  else{
        res.status(300).json({mesage: "Đã xãy ra lỗi khi lấy biểu đồ"});
    }
    }catch (err){
        console.log('loi khi xoá quyền admin: ',err);
        res.status(500).json({err: 'Đã xảy ra lỗi '})
    }
};
module.exports = {
    getChartByUserIdQuanlityAttendance,
    getChartByEventIdQuanlityAttendanceArea
}