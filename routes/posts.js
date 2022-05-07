const express = require('express');
const router = express.Router();
const Post = require('../models/postModel')
const { successHandler, errorHandler } = require('../handler');


router.get('/', async (req, res) => {
  const timeSort = req.query.timeSort == 'asc'? 1:-1
  const search = req.query.search? {"content": new RegExp(req.query.search)} : {};
  try{
    const posts =await Post.find(search).populate({
      path: 'userInfo',
      select: 'name photo'
    }).sort({'createAt': timeSort})
    successHandler(res, posts)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.post('/', async (req, res) => {
  // userInfo 可以帶users 內任一筆或是 626fea471d31613ecc953f23
  try{
    const data = req.body
    if(!data.userInfo || !data.content ){
      throw '名稱、內文、缺一不可'
    }
    const newPost = await Post.create({
        userInfo: data.userInfo,
        image: data.image,
        content: data.content,
        likes: data.likes,
        comments: data.comments,
        createdAt: data.createdAt,
      })
    successHandler(res, newPost)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/', async (req, res) => {
  try{
    await Post.deleteMany({});
    successHandler(res, [])
  }catch(error){
    errorHandler(res,error,400)
  }
});

module.exports = router;
