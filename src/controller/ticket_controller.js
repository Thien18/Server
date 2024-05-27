const e = require('express');
const TicketService = require('../service/ticket_service');
const EventService = require('../service/event_service');
const joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment');

const createTicket = async (req, res) => {
    try {
        const id = uuidv4();
        const name = req.body.name;
        const price = req.body.price;
        const event_id = req.body.event_id;
        const quantity = req.body.quantity;
        const minimum = req.body.minimum;
        const maximum = req.body.maximum;
        const opening_date = req.body.opening_date;
        const sale_end_date = req.body.sale_end_date;
        if(await TicketService.isTicketExist(event_id)){
            res.status(202).json({message : "Sự kiện đã có vé"});
            return;
        }
        if(price < 0){
            res.status(300).json({message : "Giá là số nguyên dương"});
            return;
        }
        if(quantity < 0){
            res.status(300).json({message : "Số lượng là số nguyên dương"});
            return;
        }
        if(maximum < minimum){
            res.status(300).json({message : "Số vé tối đa không được nhỏ hơn tối thiểu"});
            return;
        }
        const event = await EventService.getEventById(event_id);
        
        const start_date_e = moment(event.start_date).subtract(15, 'days');
        const start_date_t = moment(opening_date);
        if(!moment(start_date_t).isBefore(start_date_e)){
            res.status(300).json({message : "Ngày mở bán vé phải trước khi triển khai sự kiên 15 ngày"});
             return;
        }
        
        const tcheck = await TicketService.getTicketByNameAndUserId(name, event_id);
        if(tcheck){
            res.status(300).json({message : `Sự kiện đã tạo vé với tên ${name} trước đó.`});
            return;
        }
        
        const data = {id, name, price, event_id, quantity, minimum, maximum, opening_date, sale_end_date};
        const ev = await EventService.updateEvent(event_id, {is_ticket: true});
        const ticket = await TicketService.createTicket(data);
        if(ticket){
            res.status(200).json({message : "Tạo vé thành công"});
        }else
        res.status(300).json({message : "Tạo mã vé thất bại"});
    } catch (error) {
        console.error('Lỗi tại controller:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi ' });
    }
};

const disableTicket = async (req, res) => {
    try {

        const id = req.body.id;

        const ticket = await TicketService.disableTicket(id);
        if(!ticket){
            res.status(300).json({message: "Vô hiệu hoá thất bại"});
        }else
        res.status(200).json({message: "Vô hiệu hoá thành công"});

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
const getAllTicket = async (req, res) => {
    try {
        const ticket = await TicketService.getAllTicket();
        if(!ticket){
            res.status(300).json({message: "Lấy danh sách vé thất bại"});
        }else
        res.status(200).json({ticket});

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
const getTicketByUserId = async (req, res) => {
    try {

        const user_id = req.query.user_id;

        const ticket = await TicketService.getTicketByUserId(user_id);
        if(!ticket){
            res.status(300).json({message: "Lấy danh sách vé thất bại"});
        }else
        res.status(200).json({ticket});

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
const updateTicket = async (req, res) =>{
    try {

        const id = req.body.id;
        const name = req.body.name;
        const price = req.body.price;
        const event_id = req.body.event_id;
        const quantity = req.body.quantity;
        const minimum = req.body.minimum;
        const maximum = req.body.maximum;
        const opening_date = req.body.opening_date;
        const sale_end_date = req.body.sale_end_date;

        if(price < 0){
            res.status(300).json({message : "Giá là số nguyên dương"});
            return;
        }
        if(quantity < 0){
            res.status(300).json({message : "Số lượng là số nguyên dương"});
            return;
        }
        if(maximum < minimum){
            res.status(300).json({message : "Số vé tối đa không được nhỏ hơn tối thiểu"});
            return;
        }
        const event = await EventService.getEventById(event_id);
        if(event.is_ticket == false){
            await event.update({
                is_ticket: true
            });
        }
        const start_date_e = moment(event.start_date).subtract(15, 'days');
        const start_date_t = moment(opening_date);
        if(!moment(start_date_t).isBefore(start_date_e)){
            res.status(300).json({message : "Ngày mở bán vé phải trước khi triển khai sự kiên 15 ngày"});
             return;
        }

        const data = {id, name, price, event_id, quantity, minimum, maximum, opening_date, sale_end_date};

        const ticket = await TicketService.updateTicket(id,data);
        if(!ticket){
            res.status(300).json({message: "Cập nhật vé thất bại"});
        }else
        res.status(200).json({message: "Cập nhật vé thành công"});

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
const getTicketDetails = async (req, res) => {
    try {
        const id = req.query.id;
        const ticket = await TicketService.getTicketDetails(id);
        if(!ticket){
            res.status(300).json({message: "Lấy vé thất bại"});
        }else
        res.status(200).json({ticket});

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
const getTicketPayment = async (req, res) => {
    try {
        const user_id = req.query.user_id;
        const ticket = await TicketService.getTicketPayment(user_id);
        if(!ticket){
            res.status(300).json({message: "Lấy vé thất bại"});
        }else
        res.status(200).json({ticket});

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
module.exports = {
    createTicket,
    disableTicket,
    getAllTicket,
    getTicketByUserId,
    updateTicket,
    getTicketDetails,
    getTicketPayment
};