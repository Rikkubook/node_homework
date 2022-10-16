const express = require('express');
const router = express.Router();
const postControl = require('../controllers/postControllers');
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
      description: 'timeSort=old (舊到新) or 不填寫 (新到舊)',
    }
   * #swagger.parameters['likes'] = {
      in: 'query',
      description: 'timeSort=hot 最多讚，不填寫則依據 timeSort，可與 timeSort 同時使用',
    }
   * #swagger.parameters['skip'] = {
      in: 'query',
      description: 'skip=Number',
    }
   * #swagger.parameters['limit'] = {
      in: 'query',
      description: 'limit=Number',
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
                "name": "Meme"
              }
            ],
            "content": "我只是個測試唷!",
            "likes": [],
            "image": [],
            "createdAt": "2022-05-22T10:05:30.803Z",
            "comments": [
              {
                "_id": "628a0c089acb6cb7d6b70da6",
                "content": "我只是個測試唷 - 回應4",
                "postId": "628a0aea9acb6cb7d6b70d93",
                "userId": "6286d9983208cb01aafaa562",
                "createdAt": "2022-05-22T10:10:16.925Z",
                "actions": [
                  "edit",
                  "delete"
                ]
              },
              {
                "_id": "628a0c029acb6cb7d6b70da2",
                "content": "我只是個測試唷 - 回應3",
                "postId": "628a0aea9acb6cb7d6b70d93",
                "userId": "6286d9983208cb01aafaa562",
                "createdAt": "2022-05-22T10:10:10.792Z",
                "actions": [
                  "edit",
                  "delete"
                ]
              }
            ]
          },
        ]
      }
    }
   * #swagger.responses[400] = {
        description: '回傳錯誤訊息',
        schema: {
          status: false,
          message: '錯誤訊息'
        }
      }
   */
  '/', isAuth, postControl.getPosts);

// 新增貼文
router.post(
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
      description: 'timeSort=old (舊到新) or 不填寫 (新到舊)',
    }
   * #swagger.parameters['likes'] = {
      in: 'query',
      description: 'timeSort=hot 最多讚，不填寫則依據 timeSort，可與 timeSort 同時使用',
    }
   * #swagger.parameters['skip'] = {
      in: 'query',
      description: 'skip=Number',
    }
   * #swagger.parameters['limit'] = {
      in: 'query',
      description: 'limit=Number',
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
                  "name": "Meme"
                }
              ],
              "content": "我只是個測試唷!",
              "likes": [],
              "image": [],
              "createdAt": "2022-05-22T10:05:30.803Z",
              "comments": [
                {
                  "_id": "628a0c089acb6cb7d6b70da6",
                  "content": "我只是個測試唷 - 回應4",
                  "postId": "628a0aea9acb6cb7d6b70d93",
                  "userId": "6286d9983208cb01aafaa562",
                  "createdAt": "2022-05-22T10:10:16.925Z",
                  "actions": [
                    "edit",
                    "delete"
                  ]
                },
                {
                  "_id": "628a0c029acb6cb7d6b70da2",
                  "content": "我只是個測試唷 - 回應3",
                  "postId": "628a0aea9acb6cb7d6b70d93",
                  "userId": "6286d9983208cb01aafaa562",
                  "createdAt": "2022-05-22T10:10:10.792Z",
                  "actions": [
                    "edit",
                    "delete"
                  ]
                }
              ]
            },
          ]
        }
      }
   * #swagger.responses[400] = {
        description: '回傳錯誤訊息',
        schema: {
          status: false,
          message: '錯誤訊息'
        }
      }
   */
  '/',isAuth, postControl.postPost);

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