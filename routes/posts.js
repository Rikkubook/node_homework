const express = require('express');
const router = express.Router();
const postControl = require('../controllers/postControllers');
const likeControl = require('../controllers/likeControllers');
const { isAuth } = require('../service/auth')
const handleErrorAsync = require("../service/handleErrorAsync");

// 查看所有貼文
router.get('/', isAuth, handleErrorAsync(postControl.getPosts));

// 取得某人的所有貼文列表
router.get('/:id', handleErrorAsync(postControl.getPost));

// 取得某人的所有貼文列表
router.get('/user/:id', handleErrorAsync(postControl.getUserComment ));

// 新增貼文
router.post('/',isAuth, handleErrorAsync(postControl.postPost));

// 留言
router.post('/:id/comment',isAuth, handleErrorAsync(postControl.postComment));

// 新增喜歡
router.post('/:postID/like',isAuth, handleErrorAsync(likeControl.postLike));

// 刪除喜歡
router.delete('/:postID/unlike',isAuth, handleErrorAsync(likeControl.deleteLike));

// 刪除全部
router.delete('/deleteAll', handleErrorAsync(postControl.deletePost));

// 刪除單筆
router.delete('/delete/:id', handleErrorAsync(postControl.deleteOne));

module.exports = router;

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