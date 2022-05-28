const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', handleErrorAsync(
  async (req, res) => {
    const users =await User.find({});
    res.status(200).json({status:"success", data:users})
  }
));


//登入會員
router.post('/sign_in', handleErrorAsync(
  async (req, res, next) => {
    const data =req.body
    if(!data.email || !data.password){
      return next(appError(400,"帳號密碼不為空",next))
    }

    const user = await User.findOne({ email:data.email }).select('+password'); // 為了要把預設不顯示的取出，添加+
    const auth =await bcrypt.compare(data.password, user.password); //確認密碼與加密密碼

    if(!auth){
      return next(appError(400,"你的密碼不正確",next))
    }
    generateSendJWT(user,201,res);
  }
));

//註冊會員
router.post('/sign_up', handleErrorAsync(
  async(req, res, next) =>{
    const body = req.body;
    // 內容不可為空(自訂除錯)
    if(!body.email||!body.password||!body.confirmPassword||!body.name){
      return next(appError("400","欄位格式不正確",next));
    }
    // 密碼正確
    if(body.password!== body.confirmPassword){
      return next(appError("400","密碼不一致",next));
    }
    // 密碼 8 碼以上
    if(!validator.isLength(body.password,{min:8})){
      return next(appError("400","密碼不可小於 8 碼",next));
    }
    // 是否為 Email
    if(!validator.isEmail(body.email)){
      return next(appError("400","Email 格式不正確",next));
    }

    const checkEmail = await User.findOne({email: body.email})
    if(checkEmail){
      return next(appError("400","Email 重複",next));
    }
    // 加密密碼
    body.password = await bcrypt.hash(body.password,12);
    const newUser = await User.create({
      name: body.name,
      password: body.password,
      email: body.email
    });

    generateSendJWT(newUser,201,res);
  }
));

const generateSendJWT = (user,statusCode,res)=>{
  // 產生 JWT token
  const token = jwt.sign( //先簽名
    {id:user._id}, //body 顯示要顯示的"非重要"資訊
    process.env.JWT_SECRET, // 混淆碼
    {expiresIn: process.env.JWT_EXPIRES_DAY} //有效日
  );
  console.log(token)
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data:{
      token,
      user
    }
  });
}

const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') //訂定一個 Bearer
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(appError(401,'你尚未登入！',next));
  }

  // 驗證 token 正確性
  const decoded = await new Promise((resolve,reject)=>{
    jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{ // 對方token , 我的加密
      if(err){
        reject(err) // 丟去handleErrorAsync
      }else{
        resolve(payload)
      }
    })
  })
  const currentUser = await User.findById(decoded.id); //JWT 寫入

  req.user = currentUser; // 可以自訂後帶入下一個
  next();
});

//取得個人資料
router.get('/profile/',isAuth, handleErrorAsync(async(req, res, next) =>{
  res.status(200).json({
    status: 'success',
    user: req.user
  });
}))
//變更密碼
router.patch('/updatePassword',isAuth,handleErrorAsync(async(req,res,next)=>{
  const body = req.body;
  if(body.newPassword!==body.confirmPassword){
    return next(appError("400","密碼不一致！",next));
  }
  const newPassword = await bcrypt.hash(body.newPassword,12);
  
  const user = await User.findByIdAndUpdate(req.user.id,{
    password:newPassword
  });
  generateSendJWT(user,200,res)
}))
// router.delete('/', handleErrorAsync(
//   async (req, res) => {
//     await User.deleteMany({});
//     res.status(200).json({status:"success", data:[]})
//   }
// ));

// router.delete('/:id', handleErrorAsync(
//   async (req, res, next) => {
//     const id = req.params.id;
//     const resultUser = await User.findByIdAndDelete(id);
//     if(resultUser == null){
//       return next(appError(400,"查無此id",next))
//     }
//     const users =await User.find({});
//     res.status(200).json({status:"success", data:users})
//   }
// ));

router.patch('/:id', handleErrorAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const data = req.body
    const newArray = Object.keys(data)

    if(newArray.includes('name') && !data.name){
      return next(appError(400,"名字不為空",next))
    }else if(newArray.includes('email') && !data.email){
      return next(appError(400,"Email不為空",next))
    }

    const resultUser = await User.findByIdAndUpdate(id,data);
    if(resultUser == null){
      throw '查無此id'
    }

    const newData =await User.findById(id);
    res.status(200).json({status:"success", data:newData})
  }
));
module.exports = router;
