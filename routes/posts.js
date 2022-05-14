const express = require('express');
const router = express.Router();
const Post = require('../models/postModel')
const User = require('../models/userModel')
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

router.get('/', handleErrorAsync(
  async (req, res) => {
    const timeSort = req.query.timeSort == 'asc'? 1:-1
    const search = req.query.search? {"content": new RegExp(req.query.search)} : {};
    const posts =await Post.find(search).populate({
      path: 'userInfo',
      select: 'name photo'
    }).sort({'createAt': timeSort})
    res.status(200).json({status:"success", data:posts})
  }
));

router.post('/',handleErrorAsync(
  async (req, res, next) => {
  // userInfo 可以帶users 內任一筆或是 626fea471d31613ecc953f23
    const data = req.body
    const hasUser = await User.findById(data.userInfo).exec();
    if(!data.userInfo){
      return next(appError(400,"你沒有使用者ID",next)) // 統一由express
    }
    if(!data.content ){
      return next(appError(400,"你沒有輸入內容",next))
    }
    if(!hasUser){
      return next(appError(400,"沒有此使用者喔",next))
    }
    const newPost = await Post.create({
      userInfo: data.userInfo,
      image: data.image,
      content: data.content,
      likes: data.likes,
      comments: data.comments,
      createdAt: data.createdAt,
    })
    res.status(200).json({status:"success", data:newPost})
  }
));

router.delete('/', handleErrorAsync(
  async (req, res) => {
    await Post.deleteMany({});
    res.status(200).json({status:"success", data:[]})
  }
));

router.delete('/:id', handleErrorAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const resultPost = await Post.findByIdAndDelete(id);
    if(resultPost == null){
      return next(appError(400,"查無此id",next))
    }
    const posts =await Post.find({});
    res.status(200).json({status:"success", data:posts})
  }
));

router.patch('/:id', handleErrorAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const data = req.body
    const newArray = Object.keys(data)

    if(newArray.includes('content') && !data.content ){
      return next(appError(400,"你沒有輸入內容",next))
    }

    const resultUser = await Post.findByIdAndUpdate(id,data);
    if(resultUser == null){
      throw '查無此id'
    }

    const newData =await Post.findById(id);
    res.status(200).json({status:"success", data:newData})
  }
));
module.exports = router;
