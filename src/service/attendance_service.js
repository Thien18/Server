const { Sequelize, where } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite', 
  storage: process.env.DATABASE, 
});

var initModels = require("../models/init-models");
const db = initModels(sequelize);
const User = db.Users; 
const Event = db.Event;
const Attendance = db.Attendance;
const Area = db.Area;
const QR = db.QrCode;
const Member = db.Member;
const Ticket = db.Ticket;
const TicketPayment = db.TicketPayment;
const { v4: uuidv4 } = require("uuid");
const area = require('../models/area');
const { Op } = require('sequelize');


const getAllAttendanceByUserId = async (user_id) => {
  try {
    const attendances = await Attendance.findAll({
      where:{user_id, area_id: null},
      include: [
        {
          model: Event,
          as: 'event'
        }
      ]
    });
    return attendances;
  } catch (error) {
    console.error('Error fetching all attendances:', error);
    return false;
  }
};
const getAllAttendanceByEventId = async (event_id) => {
  try {
    const attendances = await Attendance.findAll({
      where:{event_id},
      include: [
        {
          model: Event,
          as: 'event'
        },
        {
          model: User,
          as: 'user'
        }
      ],
      
      
    });
    return attendances;
  } catch (error) {
    console.error('Error fetching all attendances:', error);
    return false;
  }
};
const getAllAreaByUserIdAndArea = async (user_id, event_id) => {
  try {
    const attendances = await Attendance.findAll({
      where:{user_id, event_id, area_id: { [Op.ne]: null }},
      include: [
        {
          model: Area,
          as: 'area'
        }
      ]
    });
    return attendances;
  } catch (error) {
    console.error('Error fetching all attendances:', error);
    return false;
  }
};

const createAttendance = async (code, location, user_id, device_code ) => {
  try {
    const qr = await QR.findOne(
      {
        where:{
          code
        }
      }
    );
    //console.log(">>>>>",qr);
    let ea_id; 
    let ea;
    if(qr.area_id){
      ea_id = qr.area_id;
      ea = 'Area';
    }else{
      ea_id = qr.event_id;
      ea = 'Event';
    }
    
    
    if(ea === 'Event'){
      const event = await Event.findOne({where:{id : ea_id}})
      if(event.group_id != null){
        const group_id = event.group_id;
        const is_gr = await Member.findOne({where:{user_id, group_id}})
        if(!is_gr){
          return 'Sự kiện này không bao gồm bạn';
        }
      }
      const attendacearea = await Attendance.findOne({where:{event_id : ea_id, area_id: null}});
      if(attendacearea){
        return 'Event này bạn đã điểm danh';
      }
      //checking ticket
      if(event.is_ticket){
        const is_tk_pm = await TicketPayment.findOne({where: {event_id: ea_id,user_id}});
       
        const tk = await Ticket.findOne({where: {event_id: ea_id}});
        
        if(!is_tk_pm){
          return `Bạn cần phải mua vé "${tk.dataValues.name}" để tiếp tục`;
        }
      }

      //checking distance
      const event_location = event.location;
      const [e_latitude, e_longitude] = event_location.split(',').map(coord => parseFloat(coord.trim()));
      const [a_latitude, a_longitude] = location.split(',').map(coord => parseFloat(coord.trim()));
      const distance = haversineDistance(e_latitude, e_longitude, a_latitude, a_longitude)
      if(distance > 0.5){
        return 'Khoảng cách của bạn quá xa so với điểm bạn quét mã';
      }else{
        //checking device
         
        const is_device = await Attendance.findOne({where:{
          device_code ,
          event_id: ea_id}
        });
        //console.log(is_device);
        if(is_device){
          return 'Thiết bị của bạn đã được điểm danh cho sự kiện này';
        }
        // //console.log(is_device);
      }
      const id = uuidv4();

      const attd = await Attendance.create({id, user_id, event_id: ea_id, area_id: null,location, is_status: true, device_code });
      return 'Quét mã thành công truy cập lịch sử quét mã để xem chi tiết.'
    }else{
      
      const area = await Area.findOne({where:{id : ea_id}});
      const event_id = area.event_id;
      const event = await Event.findOne({where:{id : event_id}})
      //checking attendace event
      const attendaceev = await Attendance.findOne({where:{event_id}});
      if(!attendaceev){
        return 'Bạn cần check in sự kiện trước khi quét mã khu vực';
      }
      //checking ticket phải check in event trước khi quét mã khu vực nên việc này đã làm ở trường hợp check in(quét ma event)
      // if(event.is_ticket){
      //   const is_tk_pm = await TicketPayment.findOne({where: {event_id: ea_id,user_id}});
      //   if(!is_tk_pm){
      //     return 'Bạn cần phải mua vé để tiếp tục';
      //   }
      // }
      //chedking scaned area
      const attendacearea = await Attendance.findOne({where:{area_id : ea_id}});
      if(attendacearea){
        return 'Khu vực này bạn đã điểm danh';
      }
      //checking distance
      const event_location = event.location;
      const [e_latitude, e_longitude] = event_location.split(',').map(coord => parseFloat(coord.trim()));
      const [a_latitude, a_longitude] = location.split(',').map(coord => parseFloat(coord.trim()));
      const distance = haversineDistance(e_latitude, e_longitude, a_latitude, a_longitude)
      if(distance > 0.5){
        return 'Khoảng cách của bạn quá xa so với điểm bạn quét mã';
      }
      const id = uuidv4();
      const attd = Attendance.create({id, user_id, event_id, area_id: ea_id, is_status: true, device_code });
      return 'Quét mã thành công truy cập lịch sử quét mã để xem chi tiết.'
    }
    
  } catch (error) {
    console.error('Error creating attendance:', error);
    return false;
  }
};

const updateAttendance = async (id, data) => {
  try {
    const attendance = await Attendance.findOne({
      where: { id },
    });
    if (attendance) {
      await attendance.update(data);
      return true;
    } else {
      console.log('Attendance record not found');
      return false;
    }
  } catch (error) {
    console.error('Error updating attendance:', error);
    return false;
  }
};

const deleteAttendance = async (id) => {
  try {
    const deletedCount = await Attendance.destroy({
      where: { id },
    });
    return deletedCount > 0;
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return false;
  }
};



function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Bán kính Trái Đất theo km
  const toRadians = angle => angle * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Khoảng cách theo km
  return distance;
}
module.exports = {
  getAllAttendanceByEventId,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAllAttendanceByUserId,
  getAllAreaByUserIdAndArea
};