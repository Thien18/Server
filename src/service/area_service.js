const { Sequelize, where } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite', 
  storage: process.env.DATABASE, 
});

var initModels = require("../models/init-models");
const db = initModels(sequelize);
const Area = db.Area;
const Event = db.Event; 

const getAllArea = async (event_id) => {
    try {
      const areas = await Area.findAll(
        {where:{
          event_id
        }},
        {
        include: [
          {
            model: Event,
            as: 'event', 
          },
        ],
      }
      );
      return areas;
    } catch (error) {
      console.error('Error fetching all areas:', error);
      return false;
    }
  };

const checkAreaExists = async (eventId, areaName) => {
    try {
      const result = await Area.findOne({
        where: {
          event_id: eventId,
          name: areaName,
        },
      });
      return result;
    } catch (error) {
      console.error('Lỗi khi kiểm tra trùng area', error);
    }
  };

  const getAreaById = async (id) => {
    try {
      const result = await Area.findByPk(id, {
        include: [
          {
            model: Event,
            as: 'event', 
          },
        ],
      });
      return result;
    } catch (error) {
      console.error('Error fetching Area by ID:', error);
      return false;
    }
  };

const createArea = async (data) => {
  try {
    const result  = await Area.create(data);
    return result ;
  } catch (error) {
    console.error('Error creating area:', error);
    return false;
  }
};

const updateArea = async (id, data) => {
  try {
    const area = await Area.findOne({
      where: { id },
    });
    if (area) {
      await area.update(data);
      return true;
    } else {
      console.log('Area not found');
      return false;
    }
  } catch (error) {
    console.error('Error updating area:', error);
    return false;
  }
};

const deleteArea = async (id) => {
    try {
      const deletedCount = await Area.destroy({
        where: { id },
      });
      return deletedCount > 0; // Return true if area is deleted
    } catch (error) {
      console.error('Error deleting area:', error);
      return false;
    }
  };

  module.exports = {
    checkAreaExists,
    getAllArea,
    createArea,
    updateArea,
    deleteArea,
    getAreaById,
  };

