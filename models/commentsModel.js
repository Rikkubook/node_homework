const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, '請輸入您的留言']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: [true, '需要使用者資料']
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      require: [true, '需要文章資料']
    }
  }
);

commentSchema.pre(/^find/, function(next) { // 當有查找時 findID
  this.populate({
    path: 'user',
    select: 'name id'
  });

  next();
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;