const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  userInfo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, '請輸入您的userId']
  },
  content: {
    type: String,
    required: [true,"內文必填"]
  },
  image: String,
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  createAt: {
    type: Date,
    default: Date.now,
    select: true,
  },
},
{
  versionKey: false, // __v: 引藏
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

postsSchema.virtual('comments',{ // 偷掛上的名稱
  ref:'Comment',
  foreignField: 'post', //post欄位內貼文id
  localField: '_id' // 引用跟這個貼文id一樣的留言
})

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;