const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
  userInfo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, '請輸入您的userId']
  },
  posts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
  }],
  createAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
},
{
  versionKey: false, // __v: 引藏
});

likesSchema.pre(/^find/, (next) => {
  this.populate({
    path: 'post',
    select: 'createAt'
  }).populate({
    path: 'userInfo',
    select: 'name'
  })
  next();
})

const Like = mongoose.model('like', likesSchema);

module.exports = Like;