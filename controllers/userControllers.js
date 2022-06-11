const User = require('../models/usersModel')
const appError = require("../service/appError")
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { generateSendJWT } = require('../service/auth')

const userControl ={
  getAllUsers:
    async (req, res) => {
      const users =await User.find({});
      res.status(200).json({status:"success", data:users})
    },
  getUserProfile:
    async(req, res) =>{
      res.status(200).json({status: "success", data: req.user})
    },
  getUserFollowing:
    async(req, res) =>{
      res.status(200).json({status: "success", following: req.user.following})
    },
  postUserSignIn:
    async (req, res, next) => {
      const body =req.body
      if(!body.email || !body.password){
        return next(appError(400,"帳號密碼不為空",next))
      }
      // 密碼 8 碼以上
      if(!validator.isLength(body.password,{min:8})){
        return next(appError(400 ,"密碼不可小於 8 碼",next))
      }
      // 是否為 Email
      if(!validator.isEmail(body.email)){
        return next(appError(400 ,"Email 格式不正確",next))
      }
      const user = await User.findOne({ email:body.email }).select('+password') // 為了要把預設不顯示的取出，添加+
      let auth
      if(user){
        auth = await bcrypt.compare(body.password, user.password) //確認密碼與加密密碼
      }else{
        return next(appError(400,"無此帳號",next))
      }
  
      if(!auth){
        return next(appError(400,"你的密碼不正確",next))
      }
      generateSendJWT(user,201,res);
    },
  postUserSignUp:
    async(req, res, next) =>{
      const body = req.body;
      // 內容不可為空(自訂除錯)
      if(!body.email||!body.password||!body.confirmPassword||!body.name){
        return next(appError(400 ,"欄位格式不正確",next))
      }
      // 密碼正確
      if(body.password!== body.confirmPassword){
        return next(appError(400 ,"密碼不一致",next))
      }

      // 暱稱 2 字以上
      if(!validator.isLength(body.name,{min:2})){
        return next(appError(400 ,"暱稱兩字以上",next))
      }

      let reg =/^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/
      // 密碼 8 碼以上
      if(!validator.isLength(body.password,{min:8})){
        return next(appError(400 ,"密碼不可小於 8 碼",next))
      }else if(!body.password.match(reg)){
        return next(appError(400 ,"密碼需英數混合",next))
      }
      // 是否為 Email
      if(!validator.isEmail(body.email)){
        return next(appError(400 ,"Email 格式不正確",next))
      }
  
      const checkEmail = await User.findOne({email: body.email})
      if(checkEmail){
        return next(appError(400 ,"Email 重複",next))
      }
      // 加密密碼
      body.password = await bcrypt.hash(body.password,12)
      const newUser = await User.create({
        name: body.name,
        password: body.password,
        email: body.email
      });
  
      generateSendJWT(newUser,201,res)
    },
  patchUserPassword:
    async(req,res,next)=>{
      const body = req.body;
      let reg =/^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/
      if(!validator.isLength(body.newPassword,{min:8})){
        return next(appError(400 ,"密碼不可小於 8 碼",next))
      }else if(!body.password.match(reg)){
        return next(appError(400 ,"密碼需英數混合",next))
      }
      if(body.newPassword!==body.confirmPassword){
        return next(appError(400 ,"密碼不一致！",next))
      }
      const newPassword = await bcrypt.hash(body.newPassword,12)

      const opts = { runValidators: true } //更新會再跑一次驗證規則
      const user = await User.findByIdAndUpdate(req.user.id,
        { password:newPassword },
        opts);
      if(user == null){ // patch 可能會找到空的回傳null
        return next(appError(400 ,"查無此id",next))
      }

      generateSendJWT(user,200,res)
    },
  patchUserProfile:
    async (req, res, next) => {
      const body = req.body

      if(validator.isEmpty(body.name)){
        return next(appError(400 ,"名字不為空2",next))
      }
      // 是否為 Email
      if(!validator.isEmail(body.email)){
        return next(appError(400 ,"Email 格式不正確",next))
      }
      const opts = { runValidators: true } //更新會再跑一次驗證規則
      const resultUser = await User.findByIdAndUpdate(req.user.id,
        {name: body.name, email: body.email},opts
      )
      if(resultUser == null){ // patch 可能會找到空的回傳null
        return next(appError(400 ,"查無此id",next))
      }

      const newData =await User.findById(req.user.id).select('+email') // 可能改email所以顯示
      res.status(200).json({status:"success", data:newData})
    },
  postFollow:
    async(req, res, next) =>{
      if (req.params.id === req.user.id) {
        return next(appError(401 ,'您無法追蹤自己',next))
      }
      await User.updateOne( // 我追蹤他 所以我的following要更新
        {
          _id: req.user.id,
          'following.user': { $ne: req.params.id } //先看是否有重複
        },
        {
          $addToSet: { following: { user: req.params.id } } //再塞入
        }
      )
      await User.updateOne( // 我追蹤他 所以對方的follower也要更新
        {
          _id: req.params.id,
          'followers.user': { $ne: req.user.id }
        },
        {
          $addToSet: { followers: { user: req.user.id } }
        }
      )
      res.status(200).json({status: "success", message: "您已成功追蹤！"})
    },
  deleteFollow:
    async(req, res, next) =>{
      if (req.params.id === req.user.id) {
        return next(appError(401 ,'您無法取消追蹤自己',next));
      }
      await User.updateOne(
        {
          _id: req.user.id
        },
        {
          $pull: { following: { user: req.params.id } } //取消
        }
      )
      await User.updateOne(
        {
          _id: req.params.id
        },
        {
          $pull: { followers: { user: req.user.id } }
        }
      )
      res.status(200).json({status: "success", message: "您已成功取消追蹤！"})
    }
}

module.exports = userControl;
