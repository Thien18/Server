const e = require('express');
const EventService = require('../service/event_service');
const joi = require("joi");
const { v4: uuidv4 } = require("uuid");


const createEvent= async (req, res) => {
    try {
        const id = uuidv4();
        const name = req.body.name;
        const user_id = req.body.user_id;
        const group_id = req.body.group_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const description = req.body.description;
        const event_type = req.body.event_type;
        const location = req.body.location;
        const is_ticket = req.body.is_ticket;
        const status = false;

        const echeck = await EventService.getEventByNameAndUserId(name,user_id);
        if(echeck){
            res.status(300).json({message : `Người dùng đã tạo event với tên ${name} trước đó.`});
            return;
        }
        const event = await EventService.createEvent(id, name, user_id, group_id, start_date, end_date, description, event_type, location, is_ticket, status);
        
        res.status(200).json({message : "Tạo event thành công"});
        

    } catch (error) {
        console.error('Lỗi khi lấy thông tin tài khoản:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo event' });
    }
};
const chageStatus= async (req, res) => {
    try {
        const id = req.body.id;
        const status = req.body.status;
        const event = await EventService.chageStatus(id, status)
        if(event == true){
            res.status(200).json({message : "Triển khai thành công"});
        }else{
            res.status(300).json({message : "Không thể thay đổi do không thể tìm thấy event"});
        }
        
    
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tài khoản:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi trạng thái event' });
    }
};
const getAllEventByEmail= async (req, res) => {
    try {
        const email = req.query.email;
        const event = await EventService.getAllEventByEmail(email)
        if(event){
            res.status(200).json(event);
        }else{
            res.status(300).json({message : "Không thể tìm thấy user"});
        }
        
    
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tài khoản:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách event' });
    }
};
const updateEvent= async (req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        //const user_id = req.body.user_id;
        const group_id = req.body.group_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const description = req.body.description;
        const event_type = req.body.event_type;
        const location = req.body.location;
        const is_ticket = req.body.is_ticket;
        
        const data = {name, group_id, start_date, end_date, description, event_type, location, is_ticket};
        const event = await EventService.updateEvent(id, data)
        if(event == true){
            res.status(200).json({message : "cập nhật thành công"});
        }else{
            res.status(300).json({message : "Không thể thay đổi do không thể tìm thấy event"});
        }
        
    
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tài khoản:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi trạng thái event' });
    }
};
module.exports = {
    createEvent,
    chageStatus,
    getAllEventByEmail,
    updateEvent

};