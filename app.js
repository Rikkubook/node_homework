var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //接到 cookie
var logger = require('morgan'); // 日誌
const dotenv = require("dotenv"); // env
dotenv.config({path:"./config.env"});

require('./connections/mongoose');
require('./connections/passport')

const uploadRouter = require('./routes/upload');
const postsRouter = require('./routes/posts'); //管理Router
const usersRouter = require('./routes/users'); //管理Router
// const swaggerUI = require('swagger-ui-express');
// const swaggerFile = require('./swagger-output.json');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //載入ejs

// 載入設定檔
app.use(logger('dev'));
app.use(express.json());  //app.use(bodyParser.json()); //組裝傳入的資料
app.use(express.urlencoded({ extended: false })); //app.use(bodyParser.urlencoded({ extended: false }));  // ???
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 預定靜態路由 使ejs 可以使用圖片等
app.use('/upload', uploadRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
// app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
// 404
app.use(function(req,res,next){
  res.status(404).json({
      status:"false",
      message:"您的路由不存在"
  })
})

// express 錯誤處理
// 正式環境錯誤
const resErrorProd = (err, res) => {
  console.log("resErrorProd")
  if (err.isOperational) { //可預期
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message
    });
  } else {
    // log 紀錄
    console.error('出現重大錯誤', err);
    // 送出罐頭預設訊息
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請恰系統管理員'
    });
  }
};
// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    error: err,
    stack: err.stack
  });
};
// express 錯誤處理 //next
app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && 'body' in err) {
    err.message = err.message
    err.isOperational = true;
    return resErrorProd(err, res)
    // return res.status(400).send({ status: 404, message: err.message });
  }
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  } 
  // production
  if (err.name === 'ValidationError'){ //mongoose 的欄位錯誤 error.name
    err.message = "資料欄位未填寫正確，請重新輸入！"
    err.isOperational = true;
    return resErrorProd(err, res)
  }
  resErrorProd(err, res)
});

// 程式出現重大錯誤時 (不能上正式機 被看到會反破解知道用了哪些套件)
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error(err);
	process.exit(1); //停掉該 process
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
