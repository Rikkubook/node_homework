const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '請輸入您的名字'],
    minlength: 2,
  },
  email: {
    type: String,
    required: [true, '請輸入您的 Email'],
    unique: true,
    lowercase: false,
    select: false
  },
  sex:{
    type: String,
    enum:["male","female"]
  },
  password:{
    type: String,
    required: [true,'請輸入密碼'],
    minlength: 8,
    select: false
  },
  followers: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User' 
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  following: [
    {
      user: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  googleId: String,
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
},{
  versionKey: false, // __v: 引藏
});

const User = mongoose.model('User', userSchema);

module.exports = User;