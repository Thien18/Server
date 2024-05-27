const { Sequelize, where } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite', 
  storage: process.env.DATABASE, 
});

var initModels = require("../models/init-models");
const db = initModels(sequelize);
const Comment = db.Comment;
const User = db.Users;
const getAllCommentByEventId = async (event_id) => {
    try {
      const cmt = await Comment.findAll(
        {where:{
          event_id
        },
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['name']
            },
        ]
      }
      );
      return cmt;
    } catch (error) {
      console.error('Error fetching all Comment:', error);
      return false;
    }
  };


const createComment = async (data) => {
  try {
    const result  = await Comment.create(data);
    if(result)
      return true ;
  } catch (error) {
    console.error('Error creating Comment:', error);
    return false;
  }
};



  module.exports = {
   createComment,
   getAllCommentByEventId
  };

