const express = require('express');
const router = express.Router();
const Post = require('../models/postModel')
const { successHandler, errorHandler } = require('../handler');

/* GET users listing. */
router.get('/', async (req, res) => {
  try{
    const posts =await Post.find({}).populate({
      path: 'user',
      select: 'name photo'
    })
    successHandler(res, posts)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.post('/', async (req, res) => {
  try{
    const data = req.body
    if(!data.user || !data.content ){
      throw '名稱、內文、屬性缺一不可'
    }
    const newPost = await Post.create({
        user: data.user,
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


module.exports = router;
