const express = require('express');
const router = express.Router();
const Post = require('../models/postModel')
const User = require('../models/userModel')
const appError = require("../service/appError");


router.get('/', async (req, res, next) => {
  const timeSort = req.query.timeSort == 'asc'? 1:-1
  const search = req.query.search? {"content": new RegExp(req.query.search)} : {};
  try{
    const posts =await Post.find(search).populate({
      path: 'userInfo',
      select: 'name photo'
    }).sort({'createAt': timeSort})
    res.status(200).json({status:"success", data:posts})
  }catch(error){
    next(appError(400,error,next))
  }
});



// 抽離可共用的中介
const checkKeyword = function(req,res,next){
  if(req.query.search){ // ex:: /search?q=iphone
      next()
  }else{
      res.status(400).json({ //如果沒有直接跳404 ex:: /search
      "message":`您並未輸入關鍵字`
  })
  }
}


router.post('/', async (req, res, next) => {
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
});

router.delete('/', async (req, res, next) => {
  try{
    await Post.deleteMany({});
    res.status(200).json({status:"success", data:[]})
  }catch(error){
    next(appError(400,error,next))
  }
});

module.exports = router;
