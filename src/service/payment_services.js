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
const TicketPayment = db.TicketPayment;
const createPayment = async (user_id, event_id,ticket_id ) =>{
  try {
      const id = uuidv4();
      const is_status = true;
      
     
      data = {id,user_id, event_id , is_status, ticket_id};
      
      const tp = await TicketPayment.create(data);

      return true;  
  }catch (error) {
      console.error('error in service:', error);
      return false;
  } 
};
const isCheckingPaymentForEvent = async (user_id, event_id) =>{
  try {
      
    console.log("ddđ",user_id, event_id);
      const tp = await TicketPayment.findOne({where :{user_id, event_id}});
      
      if(tp){
        return true;
      }
      return  false;  
  }catch (error) {
      console.error('error in service:', error);
      return false;
  } 
};
module.exports = {
  createPayment,
  isCheckingPaymentForEvent
};