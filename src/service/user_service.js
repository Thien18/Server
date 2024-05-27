const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize({
    dialect: 'sqlite', // Sử dụng dialect là SQLite
    storage: process.env.DATABASE, // Đường dẫn đến file SQLite
  });
var initModels = require("../models/init-models");
const roles = require('../models/roles');
const db = initModels(sequelize)
const Account = db.Account;
const User = db.Users;
const Role = db.Roles;


User.belongsTo(Account, { foreignKey: 'email' });

const getAllUser = async () =>{
    try {
        const allUser = await User.findAll({
            include: [
                {
                  model: Account,
                  as: 'Account',
                  attributes: ['status'],
                  include:[
                    {model: Role,
                      as: 'role',
                    }

                  ]
                },
              ],
        });
        return allUser;
    }catch (error) {
        console.error('Lỗi:', error);
      } 
}
const getUserbyEmail = async (email) =>{
  try {
      //console.log("ssssssssssssssssss",email);
      const allUser = await User.findOne({
        where: {email},
          include: [
              { 
                model: Account,
                as: 'Account',
                attributes: ['status'],
                include:[
                  {model: Role,
                    as: 'role',
                  }

                ]
              },
            ],
      });
      return allUser;
  }catch (error) {
      console.error('Lỗi:', error);
  } 
}
const lockedUser = async (email) =>{
    try {
        
        const lckAccount = await Account.findOne({
          where :{email} 
        });
        if (lckAccount) {
        // Nếu tìm thấy tài khoản, thì khoá nó
          
          await lckAccount.update({
            status: false
          });
          return true;
        } else {
          console.log('Không tìm thấy tài khoản service');
          return false;
        }
    }catch (error) {
        console.error('Lỗi service:', error);
      } 
};

const unlockUser = async (email) =>{
  try {
      
      const lckAccount = await Account.findOne({
        where :{email} 
      });
      if (lckAccount) {
      // Nếu tìm thấy tài khoản, thì khoá nó
        
        await lckAccount.update({
          status: true
        });
        return true;
      } else {
        console.log('Không tìm thấy tài khoản service');
        return false;
      }
  }catch (error) {
      console.error('Lỗi service:', error);
    } 
};

const upToAdmin = async (email) =>{
  try {
      
      const account = await Account.findOne({
        where :{email} 
      });
      if (account) {
      // Nếu tìm thấy tài khoản, thì khoá nó
        
        await account.update({
          role_id: '1'
        });
        return true;
      } else {
        console.log('Không tìm thấy tài khoản service');
        return false;
      }
  }catch (error) {
      console.error('Lỗi service:', error);
    } 
};
const neftToUser = async (email) =>{
  try {
      
      const account = await Account.findOne({
        where :{email} 
      });
      if (account) {
      // Nếu tìm thấy tài khoản, thì khoá nó
        
        await account.update({
          role_id: '2'
        });
        return true;
      } else {
        console.log('Không tìm thấy tài khoản service');
        return false;
      }
  }catch (error) {
      console.error('Lỗi service:', error);
    } 
};
module.exports = {
  getAllUser,
  lockedUser, 
  unlockUser,
  upToAdmin,
  neftToUser, 
  getUserbyEmail
};