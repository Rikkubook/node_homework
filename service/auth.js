
const appError = require('../service/appError'); 
const handleErrorAsync = require('../service/handleErrorAsync');
const User = require('../models/userModel')

const jwt = require('jsonwebtoken');
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

const generateSendJWT = (user,statusCode,res)=>{
  // 產生 JWT token
  const token = jwt.sign( //先簽名
    {id:user._id}, //body 顯示要顯示的"非重要"資訊
    process.env.JWT_SECRET, // 混淆碼
    {expiresIn: process.env.JWT_EXPIRES_DAY} //有效日
  );

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data:{
      token,
      user
    }
  });
}

module.exports = {
  isAuth,
  generateSendJWT
}