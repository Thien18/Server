const joi = require('joi');
const { v4: uuidv4 } = require("uuid");
const CommentService = require("../service/comment_service");

const getAllCommentByEventId = async (req, res) => {
  try {
    
    const event_id = req.query.event_id;
    const cmt = await CommentService.getAllCommentByEventId(event_id);
    res.status(200).json(cmt);
  } catch (error) {
    console.error('Lỗi khi lấy cmt:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy comment.' });
  }
};

const createComment= async (req, res) => {
    try {
      const id = uuidv4();
      const {user_id, event_id, content } = req.body;
      const data = {id, user_id, event_id, content };
 
      const cmt = await CommentService.createComment(data);
      if(cmt == true){
        res.status(200).json({message: "Thêm comment thành công"});
        return;
      }else{
        res.status(300).json({message: "Thêm comment thất bại"});
        return;
      }
      
    } catch (error) {
      console.error('Lỗi khi tạo khu vực', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo khu vực.' });
    }
};


module.exports = {
  createComment,
  getAllCommentByEventId,
};