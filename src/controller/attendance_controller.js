const AttendanceService = require('../service/attendance_service');
const joi = require('joi');
const { v4: uuidv4 } = require("uuid");

const getAllAttendanceByUserId = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const results = await AttendanceService.getAllAttendanceByUserId(user_id);
    res.json(results);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ error: 'Failed to retrieve attendance data.' });
  }
};
const getAllAttendanceByEventId = async (req, res) => {
  try {
    const event_id = req.query.event_id;
    const results = await AttendanceService.getAllAttendanceByEventId(event_id);
    res.json(results);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ error: 'Failed to retrieve attendance data.' });
  }
};
const getAllAreaByUserIdAndArea = async (req, res) => {
  try {
    const {user_id, event_id} = req.query;
    const results = await AttendanceService.getAllAreaByUserIdAndArea(user_id, event_id);
    res.json(results);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ error: 'Failed to retrieve attendance data.' });
  }
};

const createAttendance = async (req, res) => {
  try {
    const id = uuidv4();
    const {code, location, user_id, device_code} = req.body;


    const result = await AttendanceService.createAttendance(code, location, user_id, device_code);
    res.status(200).json({message: result});
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ error: 'Failed to create attendance record.' });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, event_id, area_id, location, is_status, device_code } = req.body;

    const schema = joi.object({
      user_id: joi.string().allow(null),
      event_id: joi.string().allow(null),
      area_id: joi.string().allow(null),
      location: joi.string().allow(null),
      is_status: joi.boolean(),
      device_code: joi.string().allow(null),
    });

    const { error } = await schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const result = await AttendanceService.updateAttendance(id, { user_id, event_id, area_id, location, is_status, device_code });
    if (!result) {
      res.status(404).json({ error: 'Attendance record not found.' });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Failed to update attendance record.' });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await AttendanceService.deleteAttendance(id);
    if (!result) {
      res.status(404).json({ error: 'Attendance record not found.' });
      return;
    }

    res.json({ message: 'Attendance record deleted successfully.' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: 'Failed to delete attendance record.' });
  }
};

module.exports = {
  getAllAttendanceByEventId,
  getAllAttendanceByUserId,
  getAllAreaByUserIdAndArea,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};