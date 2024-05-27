const ScheduleService = require('../service/schedule_service');
const joi = require('joi');
const { v4: uuidv4 } = require("uuid");

const getAllSchedule = async (req, res) => {
  try {
    const schedules = await ScheduleService.getAllSchedules();
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching all schedules:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách lịch trình.' });
  }
};

const getScheduleById = async (req, res) => {
    try {
      const { id} = req.params;
      const schedule = await ScheduleService.getScheduleById(id);
      if (!schedule) {
        res.status(404).json({ error: 'Lịch trình không tồn tại' });
        return;
      }
  
      res.json(schedule);
    } catch (error) {
      console.error('Error fetching schedule by ID:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy lịch trình theo ID.' });
    }
  };

const createSchedule = async (req, res) => {
  try {
    const id = uuidv4();
    const { name, event_id, start_date, end_date, description } = req.body;
    const data = { id, name, event_id, start_date, end_date, description };

    const schema = joi.object({
      name: joi.string().required(),
      event_id: joi.string().required(),
      start_date: joi.date().allow(null),
      end_date: joi.date().allow(null),
      description: joi.string().allow(null, ''),
    });

    const { error } = await schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const existingSchedule = await ScheduleService.checkScheduleExists(event_id, name);
    if (existingSchedule) {
      res.status(409).json({ error: 'Lịch trình này đã tồn tại trong sự kiện.' });
      return;
    }

    const result = await ScheduleService.createSchedule(data);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo lịch trình.' });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, event_id, start_date, end_date, description } = req.body;

    const schema = joi.object({
      name: joi.string().required(),
      event_id: joi.string().required(),
      start_date: joi.date().allow(null),
      end_date: joi.date().allow(null),
      description: joi.string().allow(null, ''),
    });

    const { error } = await schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const result = await ScheduleService.updateSchedule(id, { name, event_id, start_date, end_date, description });
    if (!result) {
      res.status(404).json({ error: 'Lịch trình không tồn tại' });
      return;
    }

    res.json({ message: 'Lịch trình đã được cập nhật.' });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật lịch trình.' });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ScheduleService.deleteSchedule(id);
    if (!result) {
      res.status(404).json({ error: 'Lịch trình không tồn tại' });
      return;
    }

    res.json({ message: 'Lịch trình đã được xóa' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa lịch trình.' });
  }
};

module.exports = {
  getAllSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleById,
};