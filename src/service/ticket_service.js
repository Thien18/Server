const e = require('express');
const { Sequelize, where } = require('sequelize');
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();
const sequelize = new Sequelize({
    dialect: 'sqlite', // Sử dụng dialect là SQLite
    storage: process.env.DATABASE, // Đường dẫn đến file SQLite
  });
var initModels = require("../models/init-models");
const db = initModels(sequelize);
const Ticket = db.Ticket;
const Event = db.Event;
const TicketPayment = db.TicketPayment;
const { Op } = require("sequelize");

const createTicket = async(data) => {
    try{
        const tk = await Ticket.create(data);
        return true;
    }catch (err){
        console.error('error in service:', err);
        return false;
    };
};
const disableTicket = async (id) => {
    try{
        const tk = await Ticket.update({status: false},{where : {id}});
        return true;
    }catch(err){
        console.error('error in service:', err);
        return false;
    }
};

const getAllTicket = async () =>{
    try{
        const currentDate = new Date();
        const tk = await Ticket.findAll({where: {
            status : true,
            opening_date: {
                [Op.lt]: currentDate, // start_date nhỏ hơn ngày hiện tại
              },
              sale_end_date: {
                [Op.gt]: currentDate, // end_date lớn hơn ngày hiện tại
              },
        },
        include: [
            {
                model: Event,
                as: 'event',
                attributes:['name']
            },
        ],});
        return tk;
    }catch(err){
        console.error('error in service:', err);
        return false;
    }
};
const getTicketByUserId = async (user_id) => {
    try{
        const event = await Event.findAll({where:{user_id}, attributes:['id']});
        
        const event_id = event.map(event => event.dataValues.id);
        const tk = await Ticket.findAll({
            where: {
                status : true,
                event_id :{
                    [Sequelize.Op.in]: event_id
                }
            },
            include: [
                {
                    model: Event,
                    as: 'event',
                    attributes:['name']
                },
            ]
        });
        return tk;
    }catch(err){
        console.error('error in service:', err);
        return false;
    }
};
const updateTicket = async(id, data) => {
    try{
        console.log(id, data);
        const tk = await Ticket.update(data, {where: {id}});
        return true;
    }catch (err){
        console.error('error in service:', err);
        return false;
    };
};
const getTicketByNameAndUserId = async (name, event_id) =>{
    try{
        const tk = await Ticket.findOne({where: {
            name,
            event_id
        }});
        return tk;
    }catch(err){
        console.error('error in service:', err);
        return false;
    }
};
const getTicketDetails = async (id) =>{
    try{
        const tk = await Ticket.findOne({where: {
            status : true,
            id
        },
        include: [
            {
                model: Event,
                as: 'event',
                
            },
        ],});
        return tk;
    }catch(err){
        console.error('error in service:', err);
        return false;
    }
};
const getTicketPayment = async (user_id) =>{
    try{
        const tk = await TicketPayment.findAll({where: {
            user_id
        },
        include: [
            {
                model: Event,
                as: 'event'
            },
            {
                model: Ticket,
                as: 'ticket',
                
            },
        ],});
        return tk;
    }catch(err){
        console.error('error in service:', err);
        return false;
    }
};
const isTicketExist = async (event_id) =>{
    try{
        const tk = await Ticket.findOne({where: {
            event_id
        }});
        
        if(tk){
            return true; ///event da co ve
        }
        return false;// e vent chua co ve
    }catch(err){
        console.error('error in service:', err);
        return false;
    }
}
module.exports = {
    createTicket,
    disableTicket,
    getAllTicket,
    getTicketByUserId,
    updateTicket,
    getTicketByNameAndUserId,
    getTicketDetails,
    getTicketPayment,
    isTicketExist

};