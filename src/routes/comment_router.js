const express = require('express');
const {
   getAllCommentByEventId,
   createComment
  } = require('../controller/comment_controller');
  
  const {verifyToken} = require ('../middlewares/verifyToken')
  const router = express.Router();

  router.get('/api/getAllCommentByEventId', verifyToken, getAllCommentByEventId);
  router.post('/api/createComment', verifyToken, createComment);

  
  module.exports = router;