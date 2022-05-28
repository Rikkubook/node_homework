const express = require('express');
const router = express.Router();
const postControl = require('../controllers/postControllers');
const { isAuth } = require('../service/auth')

// 查看所有貼文
router.get('/', isAuth, postControl.getPosts);

// 新增貼文
router.post('/',isAuth, postControl.postPost);

module.exports = router;

// router.delete('/', handleErrorAsync(
//   async (req, res) => {
//     await Post.deleteMany({});
//     res.status(200).json({status:"success", data:[]})
//   }
// ));

// router.delete('/:id', handleErrorAsync(
//   async (req, res, next) => {
//     const id = req.params.id;
//     const resultPost = await Post.findByIdAndDelete(id);
//     if(resultPost == null){
//       return next(appError(400,"查無此id",next))
//     }
//     const posts =await Post.find({});
//     res.status(200).json({status:"success", data:posts})
//   }
// ));

// router.patch('/:id', handleErrorAsync(
//   async (req, res, next) => {
//     const id = req.params.id;
//     const data = req.body
//     const newArray = Object.keys(data)

//     if(newArray.includes('content') && !data.content ){
//       return next(appError(400,"你沒有輸入內容",next))
//     }

//     const resultUser = await Post.findByIdAndUpdate(id,data);
//     if(resultUser == null){
//       throw '查無此id'
//     }

//     const newData =await Post.findById(id);
//     res.status(200).json({status:"success", data:newData})
//   }
// ));