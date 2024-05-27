const e = require('express');
const UserService = require('../service/user_service');
const joi = require("joi");

const getAllUser= async (req, res) => {
    try {
        
        const allUser = await UserService.getAllUser();
        res.json(allUser);

    } catch (error) {
        console.error('Lỗi khi lấy thông tin tài khoản:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin tài khoản.' });
    }
};
const getUserbyEmail = async (req, res) => {
    try {
        const email = req.query.email;
        
        const user = await UserService.getUserbyEmail(email);
   
        if (!user) {
            return res.status(201).json({ error: 'Không tìm thấy người dùng.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin người dùng.' });
    }
}
const lockedUser = async (req, res) =>{
    try{
        
        const email = req.body.email;
        const { error } = joi.object({ email}).validate(req.body);
        if (error)
            return res.status(400).json({
                message: error.details[0].message,
        });
        const statuslck = UserService.lockedUser(email);
        if(!statuslck){
            res.status(500).json({err: 'không tìm thấy tài khoản.'})
        }else{
            res.status(200).json({message: 'Locked successfully'})
        }
        
    }catch (err){
        console.log('loi khi khoa tk: ',err);
        res.status(500).json({err: 'Đã xảy ra lỗi khi khoa tài khoản.'})
    }
};
const unlockUser = async (req, res) =>{
    try{
        
        const email = req.body.email;
        const { error } = joi.object({ email}).validate(req.body);
        if (error)
            return res.status(400).json({
                message: error.details[0].message,
        });
        const statuslck = UserService.unlockUser(email);
        if(!statuslck){
            res.status(500).json({err: 'không tìm thấy tài khoản.'})
        }else{
            res.status(200).json({message: 'un lock successfully'})
        }
        
    }catch (err){
        console.log('loi khi mo khoa tk: ',err);
        res.status(500).json({err: 'Đã xảy ra lỗi khi mo khoa tài khoản.'})
    }
};

const upToAdmin = async (req, res) =>{
    try{
        
        const email = req.body.email;
        const { error } = joi.object({ email}).validate(req.body);
        if (error)
            return res.status(400).json({
                message: error.details[0].message,
        });
        const statuslck = UserService.upToAdmin(email);
        if(!statuslck){
            res.status(500).json({err: 'không tìm thấy tài khoản.'})
        }else{
            res.status(200).json({message: 'up to Admin successfully'})
        }
        
    }catch (err){
        console.log('lỗi khi nâng quyền user: ',err);
        res.status(500).json({err: 'Đã xảy ra lỗi khi nâng quyền.'})
    }
};

const neftToUser = async (req, res) =>{
    try{
        
        const email = req.body.email;
        const { error } = joi.object({ email}).validate(req.body);
        if (error)
            return res.status(400).json({
                message: error.details[0].message,
        });
        const statuslck = UserService.neftToUser(email);
        if(!statuslck){
            res.status(500).json({err: 'không tìm thấy tài khoản.'})
        }else{
            res.status(200).json({message: 'neft successfully'})
        }
        
    }catch (err){
        console.log('loi khi xoá quyền admin: ',err);
        res.status(500).json({err: 'Đã xảy ra lỗi khi xoá quyền admin.'})
    }
};
module.exports = {
    getAllUser,
    lockedUser,
    unlockUser,
    upToAdmin,
    neftToUser,
    getUserbyEmail
}