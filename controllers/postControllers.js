const Post = require('../models/postModel')
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

const postControl ={
  getPosts:handleErrorAsync(
    async (req, res) => {
      const timeSort = req.query.timeSort == 'asc'? 1:-1
      const search = req.query.search? {"content": new RegExp(req.query.search)} : {};
      const posts =await Post.find(search).populate({
        path: 'userInfo',
        select: 'name photo'
      }).sort({'createAt': timeSort})
      res.status(200).json({status:"success", data:posts})
    }
  ),
  postPost:handleErrorAsync(
    async (req, res, next) => {
      const data = req.body
      if(!data.content ){
        return next(appError(400,"你沒有輸入內容",next))
      }
      const newPost = await Post.create({
        userInfo: req.user.id,
        image: data.image,
        content: data.content,
        likes: data.likes,
        comments: data.comments,
        createdAt: data.createdAt,
      })
      res.status(200).json({status:"success", data:newPost})
    }
  )
}

module.exports = postControl;
