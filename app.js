var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //接到 cookie
var logger = require('morgan'); // 日誌
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"});

const DB =  process.env.DATABASE_COMPASS.replace('<password>',process.env.DATABASE_PASSWORD)

mongoose.connect(DB).then(()=>{
  console.log('資料庫連線成功')
}).catch((error)=>{
  console.log(error)
})

var postsRouter = require('./routes/posts'); //管理Router
var usersRouter = require('./routes/users'); //管理Router

var app = express();

// 程式出現重大錯誤時 (不能上正式機 被看到會反破解知道用了哪些套件)
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
	console.error(err);
	process.exit(1); //停掉該 process
});
// console.log(b)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //載入ejs

// 載入設定檔
app.use(logger('dev'));
app.use(express.json());  //app.use(bodyParser.json()); //組裝傳入的資料
app.use(express.urlencoded({ extended: false })); //app.use(bodyParser.urlencoded({ extended: false }));  // ???
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 預定靜態路由 使ejs 可以使用圖片等

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

// 404
app.use(function(req,res,next){
  res.status(404).json({
      status:"false",
      message:"您的路由不存在"
  })
})

// express 錯誤處理 //next
app.use(function(err,req,res,next){
  console.log('3.express 錯誤處理')
  res.status(err.statusCode || 500).json({
      "message": err.message,
      "statusCode": err.statusCode
  })
})

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
