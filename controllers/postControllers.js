const Post = require('../models/postsModel')
const Comment = require('../models/commentsModel');
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
      }).populate({
        path: 'comments',
        select: 'comment user'
      }).sort({'createAt': timeSort})
      res.status(200).json({status:"success", data:posts})
    }
  ),
  getPost:handleErrorAsync(
    async(req, res) =>  {
      const post = req.params.id;
      const searchPost = await Post.find({_id: post}).populate({
        path: 'comments',
        select: 'comment user'
      });
      res.status(200).json({
        status: "success",
        data: searchPost
      });
    }
  ),
  getUserComment:handleErrorAsync(
    async(req, res) =>  {
      const user = req.params.id;
      const posts = await Post.find({userInfo: user}).populate({
        path: 'comments',
        select: 'comment user'
      });
    
      res.status(200).json({
          status: "success",
          results: posts.length,
          posts
      });
    }
  ),
  postPost:handleErrorAsync(
    async (req, res, next) => {
      const body = req.body
      if(!body.content ){
        return next(appError(400,"你沒有輸入內容",next))
      }
      const newPost = await Post.create({
        userInfo: req.user.id,
        image: body.image,
        content: body.content,
        likes: body.likes,
        comments: body.comments,
        createdAt: body.createdAt,
      })
      res.status(201).json({status:"success", data:newPost})
    }
  ),
  postComment:handleErrorAsync(
    async(req, res, next) =>  {
      const body = req.body;
      if(!body.comment ){
        return next(appError(400,"你沒有輸入內容",next))
      }
      const newComment = await Comment.create({
        post: req.params.id,
        user: req.user.id,
        comment: body.comment
      });
      
      res.status(201).json({status:"success", data:{
        comments: newComment
      }})
    }
  )
}

module.exports = postControl;
