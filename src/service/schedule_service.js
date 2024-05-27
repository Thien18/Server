const { Sequelize, where } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE,
});

var initModels = require("../models/init-models");
const db = initModels(sequelize);
const Schedule = db.Schedule;
const Event = db.Event; 

const getAllSchedules = async () => {
  try {
    const schedules = await Schedule.findAll({
      include: [
        {
          model: Event,
          as: 'event', 
        },
      ],
    });
    return schedules;
  } catch (error) {
    console.error('Error fetching all schedules:', error);
    return false;
  }
};

const getScheduleById = async (id) => {
  try {
    const schedule = await Schedule.findByPk(id, {
      include: [
        {
          model: Event,
          as: 'event', 
        },
      ],
    });
    return schedule;
  } catch (error) {
    console.error('Error fetching schedule by ID:', error);
    return false;
  }
};

const checkScheduleExists = async (eventId, name) => {
  try {
    const result = await Schedule.findOne({
      where: {
        event_id: eventId,
        name: name,
      },
    });
    return result;
  } catch (error) {
    console.error('Error checking schedule existence:', error);
  }
};

const createSchedule = async (data) => {
  try {
    const result = await Schedule.create(data);
    return result;
  } catch (error) {
    console.error('Error creating schedule:', error);
    return false;
  }
};

const updateSchedule = async (id, data) => {
  try {
    const schedule = await Schedule.findByPk(id);
    if (schedule) {
      await schedule.update(data);
      return true;
    } else {
      console.log('Schedule not found');
      return false;
    }
  } catch (error) {
    console.error('Error updating schedule:', error);
    return false;
  }
};

const deleteSchedule = async (id) => {
  try {
    const deletedCount = await Schedule.destroy({
      where: { id },
    });
    return deletedCount > 0; 
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return false;
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  checkScheduleExists,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};