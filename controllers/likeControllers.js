const Like = require('../models/likesModel')
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

const likeControl ={
  getLikeList:handleErrorAsync(
    async (req, res, next) => {

      console.log(req.user.id)
      const getLikeList = await Like.find({
        userInfo: req.user.id
      }).sort({'createAt': -1});
      res.status(200).json({status:"success", data:getLikeList})
    }
  ),
  like:handleErrorAsync(
    async (req, res, next) => {
      if(!req.params.postID){
        return next(appError(400,"未選擇貼文",next))
      }

      await Like.insertOne({
        userInfo: req.user.id,
        post: req.params.postID
      });
      res.status(200).json({status:"success"})
    }
  ),
  unlike:handleErrorAsync(
    async (req, res, next) => {
      if(!req.params.postID){
        return next(appError(400,"未選擇貼文",next))
      }

      await Like.deleteOne({
        userInfo: req.user.id,
        post: req.params.postID
      });
      res.status(200).json({status:"success"})
    }
  )
}

module.exports = likeControl;
