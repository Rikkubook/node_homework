const express = require('express');
const router = express.Router();
const postControl = require('../controllers/postControllers');
const likeControl = require('../controllers/likeControllers');
const { isAuth } = require('../service/auth')
// 查看所有貼文
router.get(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得所有貼文'
   * #swagger.description = '如為登入狀態，回傳所有貼文'
   * #swagger.parameters['search'] = {
      in: 'query',
      description: 'search=',
    }
   * #swagger.parameters['timeSort'] = {
      in: 'query',
      description: 'timeSort=asc (舊到新) or 不填寫 (新到舊)',
    }
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.responses[200] = {
        description: '取得所有貼文資料',
        schema: {
          status: true,
          data: [
            {
              "_id": "628a0aea9acb6cb7d6b70d93",
              "userId": [
                {
                  "_id": "6286d9983208cb01aafaa562",
                  "name": "rikku12@gmail.com"
                }
              ],
              "content": "我只是個測試唷!",
              "likes": [],
              "createdAt": "2022-05-22T10:05:30.803Z",
            },
          ]
        }
      }
   */
  '/', isAuth, postControl.getPosts);

// 取得某人的所有貼文列表
router.get('/:id', postControl.getPost)

// 取得某人的所有貼文列表
router.get('/user/:id', postControl.getUserComment )

// 新增貼文
router.post(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '送出貼文'
   * #swagger.description = '需登入狀態，才可以送出貼文'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.parameters['body'] = {
      in: 'body',
      description: 'formdata 資料格式',
      schema: {
        content: '內文必填'
      }
    }
   * #swagger.responses[200] = {
        description: '取得所有貼文資料',
        schema: {
          status: "success",
          data: [
            {
              "_id": "628a0aea9acb6cb7d6b70d93",
              "userInfo": "6286d9983208cb01aafaa562",
              "content": "我只是個測試唷!",
              "likes": [],
              "createdAt": "2022-05-22T10:05:30.803Z",
            },
          ]
        }
      }
   * #swagger.responses[400] = {
        description: '回傳錯誤訊息',
        schema: {
          message: '你沒有輸入內容'
        }
      }
   */
  '/',isAuth, postControl.postPost);

// 留言
router.post('/:id/comment',isAuth, postControl.postComment)

// 新增喜歡
router.post('/:postID/like',isAuth, likeControl.postLike);

// 刪除喜歡
router.delete('/:postID/unlike',isAuth, likeControl.deleteLike);


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