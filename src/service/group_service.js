
const { Sequelize, where } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize({
    dialect: 'sqlite', // Sử dụng dialect là SQLite
    storage: process.env.DATABASE, // Đường dẫn đến file SQLite
  });
var initModels = require("../models/init-models");
const db = initModels(sequelize);
const Group = db.Groups;
const Member = db.Member;
const Event = db.Event;
const User = db.Users;

const { v4: uuidv4 } = require("uuid");


const createGroup = async (data) =>{
    try {
        
        const group = await Group.create(data);

        return true;  
    }catch (error) {
        console.error('error in service:', error);
        return false;
    } 
};

const updateGroup = async (id, data) => {
    try {
        const group = await Group.findOne({
            where : {id}
        });
        if(group){
            await group.update(data);
            return true;
        }else{
            console.log('Không tìm thấy group - service')
            return false;
        } 
    }catch (error) {
        console.error('error in service:', error);
    } 
};
const deleteGroup = async ( group_id) => {
    try{
        const member =  await Member.destroy({
            where: {
               id: group_id
            }
        });
        const group = await Group.destroy({
            where: {
                id: group_id
            }
        });
        const event = await Event.update(
           { group_id: null},
           {
                where: {
                    id: group_id
                }
            }   
        );
        
        return true;
    }catch(error){
        console.error('error in service:', error);
        return false;
    }
}; 
const getAllGroupByUserId = async (user_id) => {
    try{
        const group = await Group.findAll({
            where: {
                user_id
            }
        });
        return group;
    }catch(error){
        console.log('error in service', error);
        return false;
    }
};
const addMember = async (group_id,luser_id) => {
    try{
        luser_id.forEach(async e => {
            const member = await Member.create({
                id : uuidv4(),
                group_id,
                user_id : e
            });
        });
        return true;
    }catch(error){
        console.error('error in service:', error);
        return false;
    }
};

const deleteMember = async (id) => {
    try{
        const member = await Member.destroy({
            where: {
                id
            }
        });
        return true;
    }catch(error){
        console.error('error in service:', error);
        return false;
    }
};

const getAllUserByGroupId = async (group_id) => {
    try{
        const member = await Member.findAll({
            where: {
                group_id
            },
            include: [
                {
                    model: User,
                    as: 'user'
                },
            ],
        });
        return member;
    }catch(error){
        console.error('error in service:', error);
        return false;
    }
};
const getGroupByNameAndUserId = async (name, user_id)  =>{
    try{
        const group = await Group.findOne({
            where: {
                name,
                user_id
            }
        });
        return group;
    }catch(error){
        console.log('error in service', error);
        return false;
    }
}
module.exports = {
    createGroup,
    updateGroup,
    addMember,
    deleteMember,
    deleteGroup,
    getAllGroupByUserId,
    getAllUserByGroupId,
    getGroupByNameAndUserId
};