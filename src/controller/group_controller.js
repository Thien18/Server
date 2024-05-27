const e = require('express');
const GroupService = require('../service/group_service');
const joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const createGroup= async (req, res) => {
    try {
        const id = uuidv4();
        const name = req.body.name;
        const user_id = req.body.user_id;
        const data = {id, name, user_id};
        const gcheck = await GroupService.getGroupByNameAndUserId(name, user_id);
        if(gcheck){
            res.status(300).json({message : `Người dùng đã tạo group với tên ${name} trước đó.`});
            return;
        }
        const group = await GroupService.createGroup(data);
        if(!group){
            res.status(300).json({message: "Tạo group thất bại"});
        }else
        res.status(200).json({message : "Tạo group thành công"})

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};

const updateGroup= async (req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        
        const data = {name};
        
        const group = await GroupService.updateGroup(id, data);
        if(!group){
            res.status(300).json({message: "Cập nhật group thất bại"});
        }else
        res.status(200).json({message : "Cập nhật group thành công"})

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};

const deleteGroup= async (req, res) => {
    try {
        const group_id = req.body.group_id;
        
        
        const group = await GroupService.deleteGroup(group_id);
        if(!group){
            res.status(300).json({message: "Xoá group thất bại"});
        }else
        res.status(200).json({message : "Xoá group thành công"})

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
const getAllGroupByUserId = async (req, res) => {
    try {
        const user_id = req.query.user_id;
        
        
        const group = await GroupService.getAllGroupByUserId(user_id);
        if(!group){
            res.status(300).json({message: "lấy group thất bại"});
        }else
        res.status(200).json(group);

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
const addMember = async (req, res) => {
    try {

        const group_id = req.body.group_id;
        const user_id = req.body.user_id;
        
        const group = await GroupService.addMember(group_id, user_id);
        if(!group){
            res.status(300).json({message: "thêm member thất bại"});
        }else
        res.status(200).json({message: "thêm member thành công"});

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
const deleteMember = async (req, res) => {
    try {

        const id = req.body.id;
        
        const group = await GroupService.deleteMember(id);
        if(!group){
            res.status(300).json({message: "Xoá member thất bại"});
        }else
        res.status(200).json({message: "Xoá member thành công"});

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};
const getAllUserByGroupId = async (req, res) => {
    try {
        const group_id = req.query.group_id;
        
        
        const mem = await GroupService.getAllUserByGroupId(group_id);
        if(!mem){
            res.status(300).json({message: "lấy member thất bại"});
        }else
        res.status(200).json(mem);

    } catch (error) {
        console.error('error in controller', error);
        res.status(500).json({ error: 'errorr in server' });
    }
};

module.exports = {
    createGroup,
    updateGroup,
    deleteGroup,
    getAllGroupByUserId,
    addMember,
    deleteMember,
    getAllUserByGroupId
};