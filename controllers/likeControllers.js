const Like = require('../models/likesModel');
const Post = require('../models/postsModel');
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const { postFollow } = require('./userControllers');

const likeControl ={
  getLikeList:handleErrorAsync(
    async (req, res, next) => {
      const getLikeList = await Like.find({
        userInfo: req.user.id
      }).sort({'createAt': -1});
      res.status(200).json({status:"success", data:getLikeList})
    }
  ),
  postLike:handleErrorAsync(
    async (req, res, next) => {
      if(!req.params.postID){
        return next(appError(400,"未選擇貼文",next))
      }
      const post =  await Post.findOne({_id:req.params.postID})
      const checkInclude = post.likes.some(function (like) { //避免重複送出
        return like.equals(req.user.id);
      });
      if(!checkInclude){
        await Like.create({
          userInfo: req.user.id,
          posts: req.params.postID
        });
        await Post.findByIdAndUpdate(req.params.postID, {$addToSet: {likes:req.user.id}});
        res.status(201).json({status:"success", message: "新增收藏"});
      }else{
        res.status(201).json({status:"success", message: "不能重複收藏"});
      }
    }
  ),
  deleteLike:handleErrorAsync(
    async (req, res, next) => {
      if(!req.params.postID){
        return next(appError(400,"未選擇貼文",next))
      }
      await Like.deleteOne({
        userInfo: req.user.id,
        posts: req.params.postID
      });
      await Post.findByIdAndUpdate(req.params.postID, {$pull: {likes:req.user.id}});
      res.status(200).json({status:"success", message: "取消收藏"})
    }
  )
}

module.exports = likeControl;
