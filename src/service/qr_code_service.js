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
const QrCode = db.QrCode;

const createQR = async (event_id, area_id) =>{
    try {
        const id = uuidv4();
        const code = uuidv4() + uuidv4();
        let data = {};
       
        data = {id, event_id , area_id, code};
        
        const qr = await QrCode.create(data);

        return true;  
    }catch (error) {
        console.error('error in service:', error);
        return false;
    } 
};
const getAllQRByEventId = async (event_id) =>{
    try {
     
        const qr = await QrCode.findAll({
            where: {
                event_id
            }
        });
        return qr;  
    }catch (error) {
        console.error('error in service:', error);
        return false;
    } 
};
const getQRArea = async (area_id) =>{
    try {
     
        const qr = await QrCode.findOne({
            where: {
                area_id
            }
        });
        return qr;  
    }catch (error) {
        console.error('error in service:', error);
        return false;
    } 
};
const getQREvent = async (event_id) =>{
    try {
     
        const qr = await QrCode.findOne({
            where: {
                event_id,
                area_id: null
            }
        });
        return qr;  
    }catch (error) {
        console.error('error in service:', error);
        return false;
    } 
};
module.exports = {
    createQR,
    getAllQRByEventId,
    getQRArea,
    getQREvent
};