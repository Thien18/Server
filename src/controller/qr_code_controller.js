const e = require('express');
const QRService = require('../service/qr_code_service');
const joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const createQR = async (req, res) => {
    try {
        const event_id = req.body.event_id;
        const area_id = req.body.area_id;
        const qr = await QRService.createQR(event_id, area_id);
        if(qr){
            res.status(200).json({message : "Tạo mã qr thành công"});
        }else
        res.status(300).json({message : "Tạo mã qr thất bại"});
    } catch (error) {
        console.error('Lỗi tại controller:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi ' });
    }
};
const getAllQRByEventId = async (req, res) => {
    try {
        const event_id = req.query.event_id;
        const qr = await QRService.getAllQRByEventId(event_id);
        if(qr){
            res.status(200).json(qr);
        }else
        res.status(300).json({message : "Lấy mã qr thất bại"});
    } catch (error) {
        console.error('Lỗi tại controller:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi ' });
    }
};
const getQRArea = async (req, res) => {
    try {
        const area_id = req.query.area_id;
        const qr = await QRService.getQRArea(area_id);
        if(qr){
            res.status(200).json(qr);
        }else
        res.status(300).json({message : "Lấy mã qr thất bại"});
    } catch (error) {
        console.error('Lỗi tại controller:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi ' });
    }
};
const getQREvent = async (req, res) => {
    try {
        const event_id = req.query.event_id;
        const qr = await QRService.getQREvent(event_id);
        if(qr){
            res.status(200).json(qr);
        }else
        res.status(300).json({message : "Lấy mã qr thất bại"});
    } catch (error) {
        console.error('Lỗi tại controller:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi ' });
    }
};
module.exports = {
    createQR,
    getAllQRByEventId,
    getQRArea,
    getQREvent
};