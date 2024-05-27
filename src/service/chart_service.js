const e = require('express');
const { Sequelize, where } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize({
    dialect: 'sqlite', // Sử dụng dialect là SQLite
    storage: process.env.DATABASE, // Đường dẫn đến file SQLite
  });
var initModels = require("../models/init-models");
const db = initModels(sequelize);
const Event = db.Event;
const Attendance = db.Attendance;
const { Op } = require("sequelize");
const Area = db.Area;
const getChartByUserIdQuanlityAttendance = async (user_id) =>{
    try {
        const events = await Event.findAll({where:{user_id}});
        const attendanceCounts = await Attendance.findAll({
            attributes: ['event_id', [sequelize.fn('COUNT', sequelize.col('user_id')), 'attendanceCount']],
            
            // where: {
            //     area_id: null
            // },
            group: ['event_id']
        });
        // const attendanceTotal = await Attendance.findAll({
        //     attributes: [[sequelize.fn('SUM', sequelize.col('attendanceCount')), 'totalAttendance']]
        // });
        
        const eventList = events.map(event => {
            const attendance = attendanceCounts.find(attendance => attendance.event_id === event.id);
            
            return {
              Event_id: event.id,
              nameEvent: event.name,
              attendanceCount: attendance ? attendance.dataValues.attendanceCount : 0,
            };
          });
        let totalAttendance = 0;

        eventList.forEach((event) => {
        totalAttendance += event.attendanceCount;
        });
        const eventListTotal = eventList.map((event) =>{
            return {
                ...event,
                rate: event.attendanceCount/totalAttendance
            }
        })
        console.log(eventListTotal);
        return {eventListTotal, totalAttendance};
    }catch (error) {
        console.error('error in service:', error);
    } 
};
const getChartByEventIdQuanlityAttendanceArea = async (event_id) =>{
    try {
        const area = await Area.findAll({where:{event_id}});
        const attendanceCounts = await Attendance.findAll({
            attributes: ['area_id', [sequelize.fn('COUNT', sequelize.col('user_id')), 'attendanceCount']],
            
            where: {
                area_id: {
                    [Op.not]: null
                  }
            },
            group: ['area_id']
        });
        
        
        
        const areaList = area.map(area => {
            const attendance = attendanceCounts.find(attendance => attendance.area_id === area.id);
            console.log(attendance);
            return {
              area_id: area.id,
              name_area: area.name,
              attendanceCount: attendance ? attendance.dataValues.attendanceCount : 0,
            };
          });
        let totalAttendance = 0;

        areaList.forEach((area) => {
        totalAttendance += area.attendanceCount;
        });
        const areaListTotal = areaList.map((area) =>{
            return {
                ...area,
                rate: area.attendanceCount/totalAttendance
            }
        })
        //console.log(areaListTotal);
        return {areaListTotal, totalAttendance};
    }catch (error) {
        console.error('error in service:', error);
    } 
};
module.exports = {
    getChartByUserIdQuanlityAttendance,
    getChartByEventIdQuanlityAttendanceArea
};