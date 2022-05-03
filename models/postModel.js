const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, '請輸入您的名字']
  },
  content: {
    type: String,
    required: [true,"內文必填"]
  },
  image: String,
  likes: {
    type: Number,
    default: 0
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false
  },
},
{
  versionKey: false, // __v: 引藏
});

const Post = mongoose.model('post', postsSchema);

module.exports = Post;