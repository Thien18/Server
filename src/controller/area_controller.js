const AreaService = require('../service/area_service');
const joi = require('joi');
const { v4: uuidv4 } = require("uuid");
const QRService = require("../service/qr_code_service");
const getAllArea = async (req, res) => {
  try {
    const event_id = req.query.event_id;
    const result = await AreaService.getAllArea(event_id);
    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khu vực', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách khu vực.' });
  }
};

const getAreaById = async (req, res) => {
  try {
    const { id} = req.params;
    const schedule = await AreaService.getAreaById(id);
    if (!schedule) {
      res.status(404).json({ error: 'Khu vực không tồn tại' });
      return;
    }

    res.json(schedule);
  } catch (error) {
    console.error('Error fetching Area by ID:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy Khu vực theo ID.' });
  }
};

const createArea = async (req, res) => {
    try {
      const id = uuidv4();
      const { name, event_id, start_date, end_date, description } = req.body;
      const data = {id, name, event_id, start_date, end_date, description};

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
  
      const existingArea = await AreaService.checkAreaExists(event_id, name);
      if (existingArea) {
        res.status(409).json({ error: 'Khu vực này đã tồn tại trong sự kiện.' });
        return;
      }
      
      const result = await AreaService.createArea(data);
      const area_id = id;
      const qr = await QRService.createQR(event_id,area_id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Lỗi khi tạo khu vực', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo khu vực.' });
    }
};

const updateArea = async (req, res) => {
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

    const result = await AreaService.updateArea(id, { name, event_id, start_date, end_date, description });
    if (!result) {
      res.status(404).json({ error: 'Khu vực không tồn tại' });
      return;
    }

    res.json({ message: 'Khu vực đã được cập nhật.' });
  } catch (error) {
    console.error('Lỗi khi cập nhật khu vực', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật khu vực.' });
  }
};

const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await AreaService.deleteArea(id);
    if (!result) {
      res.status(404).json({ error: 'Khu vực không tồn tại' });
      return;
    }

    res.json({ message: 'Khu vực đã được xóa' });
  } catch (error) {
    console.error('Lỗi khi xóa khu vực', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa khu vực.' });
  }
};

module.exports = {
  getAllArea,
  createArea,
  updateArea,
  deleteArea,
  getAreaById,
};