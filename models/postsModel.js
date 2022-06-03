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
  comments: [],
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

postsSchema.virtual('comments',{
  ref:'comment',
  foreignField: 'post',
  localField: '_id'
})

const Post = mongoose.model('post', postsSchema);

module.exports = Post;