const e = require('express');
const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize({
    dialect: 'sqlite', // Sử dụng dialect là SQLite
    storage: process.env.DATABASE, // Đường dẫn đến file SQLite
  });
var initModels = require("../models/init-models");
const db = initModels(sequelize);
const Event = db.Event;
const User = db.Users;
const QRService = require("./qr_code_service");
const createEvent = async (id, name, user_id, group_id, start_date, end_date, description, event_type, location, is_ticket, status) =>{
    try {
        
        const event = await Event.create({id, name, user_id, group_id, start_date, end_date, description, event_type, location, is_ticket : false, status});
        const event_id = id;
        const area_id = null;
        const QR = QRService.createQR(event_id,area_id);
        return "Tạo event thành công";  
    }catch (error) {
        console.error('error in service:', error);
        return "tạo event thất bại";
    } 
}
const chageStatus = async (id, status) =>{
    try {
        const event = await Event.findOne({
            where : {id}
        });
        if(event){
            await event.update({status});
            return true;
        }else{
            console.log('Không tìm thấy event - service')
            return false;
        } 
    }catch (error) {
        console.error('error in service:', error);
    } 
};
const getAllEventByEmail = async (email) =>{
    try {
        
        const user = await User.findOne({
            where : {email}
        });
        
        if(user){
            const user_id = user.id;
            
            const event =  await Event.findAll({
                where : {
                    user_id: user_id
                }
            });
            return event;
        }else{
            console.log('Không tìm thấy tài khoản - service')
            return false;
        }
        
    }catch (error) {
        console.error('error in service:', error);
    } 
};
const updateEvent = async (id, data) =>{
    try {
        const event = await Event.findOne({
            where : {id}
        });
        if(event){
            await event.update(data);
            return true;
        }else{
            console.log('Không tìm thấy event - service')
            return false;
        } 
    }catch (error) {
        console.error('error in service:', error);
    } 
};
const getEventById = async (id) =>{
    try {
            const event =  await Event.findOne({
                where : {
                    id
                }
            });
            return event;
    }catch (error) {
        console.error('error in service:', error);
        return false;
    } 
};
const getEventByNameAndUserId = async  (name, user_id) => {
    try {
        const event =  await Event.findOne({
            where : {
                name,
                user_id
            }
        });
        return event;
    }catch (error) {
        console.error('error in service:', error);
        return false;
    } 
}
module.exports = {
    createEvent,
    chageStatus,
    getAllEventByEmail,
    updateEvent,
    getEventById,
    getEventByNameAndUserId
};