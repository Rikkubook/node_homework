const express = require('express');
const router = express.Router();
const postControl = require('../controllers/postControllers');
const likeControl = require('../controllers/likeControllers');
const { isAuth } = require('../service/auth')
const handleErrorAsync = require("../service/handleErrorAsync");

// 查看所有貼文
router.get(
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得所有貼文'
   * #swagger.description = '如為登入狀態，取得所有貼文'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.responses[200] = {
      description: '取得所有貼文資料',
      schema: {
        status: "success",
        data: [
          {
            "_id": "62b2df7339ae3b801040139c",
            "userInfo": {
                "_id": "62b2cea939ae3b8010401333",
                "name": " "
            },
            "content": " ",
            "likes": [
                "62b2cea939ae3b8010401333",
                "629cbcb2c29b1d7b99b71e77"
            ],
            "createAt": "2022-06-22T09:22:59.610Z",
            "comments": [
                {
                    "_id": "62b2df9439ae3b80104013a6",
                    "comment": " ",
                    "user": {
                        "_id": "62b2cea939ae3b8010401333",
                        "name": " "
                    },
                    "post": "62b2df7339ae3b801040139c"
                }
            ],
            "id": "62b2df7339ae3b801040139c"
          },
          {
            "_id": "62b2df6f39ae3b8010401399",
            "userInfo": {
              "_id": "62b2cea939ae3b8010401333",
              "name": " "
            },
            "content": "123",
            "likes": [],
            "createAt": "2022-06-22T09:22:55.245Z",
            "comments": [],
            "id": "62b2df6f39ae3b8010401399"
          }
        ]
      }
    }
   * #swagger.responses[401] = {
        description: '回傳錯誤訊息',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   */
  '/', isAuth, handleErrorAsync(postControl.getPosts));

// 取得某則貼文列表
router.get(
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得某則貼文列表'
   * #swagger.description = '取得某則貼文'
   * #swagger.parameters['id'] = {
      in: 'path',
      description: '文章ID',
    }
   * #swagger.responses[200] = {
        description: '取得某則貼文列表',
        schema: {
          status: "success",
          data: [
            {
              "_id": "62b2df7339ae3b801040139c",
              "userInfo": "62b2cea939ae3b8010401333",
              "content": " ",
              "likes": [
                "62b2cea939ae3b8010401333",
                "629cbcb2c29b1d7b99b71e77"
              ],
              "createAt": "2022-06-22T09:22:59.610Z",
              "comments": [
                {
                  "_id": "62b2df9439ae3b80104013a6",
                  "comment": " ",
                  "user": {
                      "_id": "62b2cea939ae3b8010401333",
                      "name": " "
                  },
                  "post": "62b2df7339ae3b801040139c"
                }
              ],
              "id": "62b2df7339ae3b801040139c"
            }
          ]
        }
      }
   * #swagger.responses[404] = {
        description: '回傳錯誤訊息',
        schema: {
          status: "false",
          message: '您的路由不存在'
        }
      }
   * #swagger.responses[500] = {
        description: '回傳錯誤訊息',
        schema: {
          status: "error",
          message: '系統錯誤，請恰系統管理員'
        }
      }
   */
  '/:id', handleErrorAsync(postControl.getPost));

// 取得某人的所有貼文列表
router.get(
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得某人的所有貼文列表'
   * #swagger.description = '取得某人的所有貼文列表'
   * #swagger.parameters['id'] = {
      in: 'path',
      description: '某人ID',
    }
   * #swagger.responses[200] = {
        description: '取得某人的所有貼文列表',
        schema: {
          status: "success",
          results: 2,
          data: [
            {
                "_id": "62a4937d4d50c41c8ba0c021",
                "userInfo": "6291949cbea952d620161823",
                "content": "測試用1",
                "likes": [],
                "createAt": "2022-06-11T13:07:09.518Z",
                "comments": [],
                "id": "62a4937d4d50c41c8ba0c021"
            },
            {
              "_id": "62a495194d55575754cb5266",
              "userInfo": "6291949cbea952d620161823",
              "content": "測試用4",
              "likes": [
                "62b2cea939ae3b8010401333"
              ],
              "createAt": "2022-06-11T13:14:01.847Z",
              "comments": [
                {
                  "_id": "62a4959ad30f2dd097cffb16",
                  "comment": "Hi 你好",
                  "user": {
                    "_id": "6291949cbea952d620161823",
                    "name": "Rikku12"
                  },
                  "post": "62a495194d55575754cb5266"
                },
              ],
              "id": "62a495194d55575754cb5266"
            },
          ]
        }
      }
   * #swagger.responses[404] = {
        description: '回傳錯誤訊息',
        schema: {
          status: "false",
          message: '您的路由不存在'
        }
      }
   * #swagger.responses[500] = {
        description: '回傳錯誤訊息',
        schema: {
          status: "error",
          message: '系統錯誤，請恰系統管理員'
        }
      }
   */
  '/user/:id', handleErrorAsync(postControl.getUserComment ));

// 新增貼文
router.post(
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '新增貼文'
   * #swagger.description = '如為登入狀態，新增貼文'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.parameters['body'] = {
      in: 'body',
      description: 'row JSON',
      schema: {
        content: "Betty 測試",
      }
    }
   * #swagger.responses[200] = {
        description: '新增貼文',
        schema: {
          status: "success",
          data: {
            "userInfo": "629cbcb2c29b1d7b99b71e77",
            "content": "Betty 測試",
            "likes": [],
            "_id": "635cdf1742f0df8d2257f02d",
            "createAt": "2022-10-29T08:06:47.641Z",
            "comments": [],
            "id": "635cdf1742f0df8d2257f02d"
          }
        }
      }
   * #swagger.responses[401] = {
        description: '回傳錯誤訊息',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   *
   * #swagger.responses[400] = {
        description: '回傳錯誤訊息',
        schema: {
          status: 400,
          message: '你沒有輸入內容'
        }
      }
   */
  '/',isAuth, handleErrorAsync(postControl.postPost));

// 留言
router.post(
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '新增留言'
   * #swagger.description = '如為登入狀態，新增留言'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.parameters['id'] = {
      in: 'path',
      description: '文章ID',
    }
   * #swagger.parameters['body'] = {
      in: 'body',
      description: 'row JSON',
      schema: {
        content: "Betty 測試",
      }
    }
   * #swagger.responses[200] = {
        description: '新增留言',
        schema: {
          status: "success",
          data: {
            "comments": {
              "comment": "hahaha",
              "user": "629cbcb2c29b1d7b99b71e77",
              "post": "62b2df7339ae3b801040139c",
              "_id": "635ce17757737e6513256376",
              "createdAt": "2022-10-29T08:16:55.594Z",
              "__v": 0
            }
          }
        }
      }
   * #swagger.responses[401] = {
        description: '回傳錯誤訊息',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   *
   * #swagger.responses[400] = {
        description: '回傳錯誤訊息',
        schema: {
          status: 400,
          message: '你沒有輸入內容'
        }
      }
   */
  '/:id/comment',isAuth, handleErrorAsync(postControl.postComment));

// 新增喜歡
router.post(
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '新增喜歡'
   * #swagger.description = '如為登入狀態，新增喜歡'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.parameters['postID'] = {
      in: 'path',
      description: '文章ID',
    }
   * #swagger.responses[200] = {
        description: '新增喜歡',
        schema: {
          status: "success",
          message: "新增收藏"
        }
      }
   * #swagger.responses[401] = {
        description: '回傳錯誤訊息',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   */
  '/:postID/like',isAuth, handleErrorAsync(likeControl.postLike));

// 刪除喜歡
router.delete(
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '刪除喜歡'
   * #swagger.description = '如為登入狀態，刪除喜歡'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.parameters['postID'] = {
      in: 'path',
      description: '文章ID',
    }
   * #swagger.responses[200] = {
        description: '刪除喜歡',
        schema: {
          status: "success",
          message: "取消收藏"
        }
      }
   * #swagger.responses[401] = {
        description: '回傳錯誤訊息',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   */
  '/:postID/unlike',isAuth, handleErrorAsync(likeControl.deleteLike));

// 刪除全部
router.delete(
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '刪除全部貼文'
   * #swagger.description = '如為登入狀態，刪除全部貼文'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.responses[200] = {
      description: '刪除全部貼文',
      schema: {
        status: "success",
        data: []
      }
    }
   * #swagger.responses[401] = {
        description: '回傳錯誤訊息',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   */
  '/deleteAll', handleErrorAsync(postControl.deletePost));

// 刪除單筆
router.delete(
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '刪除單筆'
   * #swagger.description = '如為登入狀態，刪除單筆'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.parameters['id'] = {
      in: 'path',
      description: '文章ID',
    }
   * #swagger.responses[200] = {
        description: '刪除單筆,回剩下的文章',
        schema: {
          status: "success",
          data: [
            {
              "_id": "62a4937d4d50c41c8ba0c021",
              "userInfo": "6291949cbea952d620161823",
              "content": "測試用1",
              "likes": [],
              "createAt": "2022-06-11T13:07:09.518Z",
              "id": "62a4937d4d50c41c8ba0c021"
            }
          ]
        }
      }
   * #swagger.responses[401] = {
        description: '回傳錯誤訊息',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   */
  '/delete/:id', handleErrorAsync(postControl.deleteOne));

module.exports = router;
