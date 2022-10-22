const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userControllers');
const likeControl = require('../controllers/likeControllers');
const handleErrorAsync = require("../service/handleErrorAsync")
const { isAuth, generateUrlJWT } = require('../service/auth')

const passport =require('passport')

/* GET users listing. */
router.get(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '取得所有使用者'
   * #swagger.responses[200] = {
        description: '取得所有使用者',
        schema: {
          status: "success",
          data: [
            {
              "_id": "626fea471d31613ecc953f23",
              "name": "Josh",
              "photo": "https://thumb.fakeface.rest/thumb_male_10_8c02e4e9bdc0e103530691acfca605f18caf1766.jpg",
              "followers": [
                  {
                      "user": "6291949cbea952d620161823",
                      "_id": "629f689380539ccc86571a1f",
                      "createdAt": "2022-06-07T15:02:43.096Z"
                  }
              ],
              "following": [
                {
                    "user": "626fea471d31613ecc953f23",
                    "_id": "629f689280539ccc86571a1d",
                    "createdAt": "2022-06-07T15:02:42.894Z"
                }
              ]
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
  '/', userControl.getAllUsers);

// 登入權限測試
router.get(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '登入權限測試'
   * #swagger.description = '如為登入狀態，回傳使用者資訊'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.responses[200] = {
        description: '登入權限測試',
        schema: {
          status: 'success',
          data: {
            "_id": "629cbcb2c29b1d7b99b71e77",
            "name": "Betty",
            "followers": [
                {
                    "user": "6353efdcd9521f0232786fc0",
                    "_id": "6353f056d9521f0232786fcd",
                    "createdAt": "2022-10-22T13:29:58.256Z"
                }
            ],
            "following": [
                {
                    "user": "62923f05e8cbfe0e09efb65f",
                    "_id": "6352c29d670d0f4955200deb",
                    "createdAt": "2022-10-21T16:02:37.565Z"
                }
            ]
          }
        }
      }
   * #swagger.responses[401] = {
        description: '你尚未登入！',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   */
  '/check', isAuth, handleErrorAsync(userControl.getUserProfile));

// 取得個人追蹤者
router.get(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '取得個人追蹤者'
   * #swagger.description = '如為登入狀態，取得個人追蹤者'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.responses[200] = {
        description: '取得個人追蹤者',
        schema: {
          status: 'success',
          data: {
            id: '629cbcb2c29b1d7b99b71e77',
            name: 'Betty',
            followers: [
              {
                "user": "6353efdcd9521f0232786fc0",
                "_id": "6353f056d9521f0232786fcd",
                "createdAt": "2022-10-22T13:29:58.256Z"
              }
            ],
            following: [
              {
                "user": "62923f05e8cbfe0e09efb65f",
                "_id": "6352c29d670d0f4955200deb",
                "createdAt": "2022-10-21T16:02:37.565Z"
              }
            ]
          }
        }
      }
   * #swagger.responses[401] = {
        description: '你尚未登入！',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   */
  '/following',isAuth, handleErrorAsync(userControl.getUserFollowing));

// 取得個人喜愛貼文
router.get(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '取得個人喜愛貼文'
   * #swagger.description = '如為登入狀態，取得個人喜愛貼文'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.responses[200] = {
        description: '取得個人喜愛貼文',
        schema: {
          status: 'success',
          data: [
            {
                "_id": "6352c1d21f9676615625f54a",
                "userInfo": {
                    "_id": "629cbcb2c29b1d7b99b71e77",
                    "name": "Betty"
                },
                "posts": {
                    "_id": "62b2df7339ae3b801040139c",
                    "createAt": "2022-06-22T09:22:59.610Z",
                    "id": "62b2df7339ae3b801040139c"
                }
            }
          ]
        }
      }
   * #swagger.responses[401] = {
        description: '你尚未登入！',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   */
  '/getLikeList',isAuth, handleErrorAsync(likeControl.getLikeList));

// 登入會員
router.post(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '使用者登入'
   * #swagger.parameters['body'] = {
      in: 'body',
      description: 'formdata 資料格式',
      schema: {
        email: "may@gmail.com",
        password: "qwe1112233"
      }
    }
   * #swagger.responses[200] = {
      description: '使用者登入',
      schema: {
        status: "success",
        data: {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWNiY2IyYzI5YjFkN2I5OWI3MWU3NyIsImlhdCI6MTY2NjQ0NTk3NSwiZXhwIjoxNjY5MDM3OTc1fQ.tJ9jqRYE6QMYo5fPC90QTJxzsTdkB3i3pxr94-aH-R4",
          "user": {
            "_id": "629cbcb2c29b1d7b99b71e77",
            "name": "Betty",
            "followers": [
              {
                  "user": "6353efdcd9521f0232786fc0",
                  "_id": "6353f056d9521f0232786fcd",
                  "createdAt": "2022-10-22T13:29:58.256Z"
              }
            ],
            "following": [
              {
                  "user": "62923f05e8cbfe0e09efb65f",
                  "_id": "6352c29d670d0f4955200deb",
                  "createdAt": "2022-10-21T16:02:37.565Z"
              }
            ]
          }
        }
      }
    }
   * #swagger.responses[400] = {
      description: '回傳錯誤訊息',
      schema: {
        status: 400,
        message: '帳號密碼不為空'
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
  '/sign_in', handleErrorAsync(userControl.postUserSignIn));

// 註冊會員
router.post(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '使用者註冊'
   * #swagger.parameters['body'] = {
      in: 'body',
      description: 'formdata 資料格式',
      schema: {
        name: "May",
        email: "may123@gmail.com",
        password: "qwe1112233",
        confirmPassword: "qwe1112233"
      }
    }
   * #swagger.responses[200] = {
        description: '使用者註冊',
        schema: {
          status: "success",
          data: {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDE3YmM1OWQzYTkzN2NhZGJiYTA5ZSIsImlhdCI6MTY2NTIzNTkwOSwiZXhwIjoxNjY3ODI3OTA5fQ.uMGsjy0OtAJgikIwfEaq6Dll2PvmV0S-ekH31Fdd1zM",
            "user": {
                "name": "May",
                "email": "may123@gmail.com",
                "_id": "63417bc59d3a937cadbba09e",
                "followers": [],
                "following": [],
                "createdAt": "2022-10-08T13:31:49.107Z"
            }
          }
        }
      }
   * #swagger.responses[400] = {
      description: '回傳錯誤訊息',
      schema: {
        status: 400,
        message: '內容不為空 / 密碼不一致 / 密碼不可小於 8 碼 / Email 重複 / Email 重複'
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
  '/sign_up', handleErrorAsync(userControl.postUserSignUp));

// 新增追蹤
router.post(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '新增追蹤'
   * #swagger.description = '如為登入狀態，新增追蹤'
   * #swagger.security = [{ apiKeyAuth: []}]
   *  #swagger.parameters['id'] = {
        in: 'path',
        description: '追隨ID',
      }
   * #swagger.responses[200] = {
        description: '新增追蹤',
        schema: {
          status: 'success',
          message: '您已成功追蹤！'
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
  '/:id/follow',isAuth, handleErrorAsync(userControl.postFollow));

// 變更密碼
router.patch(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '變更密碼'
   * #swagger.description = '如為登入狀態，變更密碼'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.parameters['body'] = {
      in: 'body',
      description: 'formdata 資料格式',
      schema: {
        newPassword: "qweasd122",
        confirmPassword: "qweasd122"
      }
    }
   * #swagger.responses[200] = {
        description: '變更密碼',
        schema: {
          status: "success",
          data: [
            {
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWNiY2IyYzI5YjFkN2I5OWI3MWU3NyIsImlhdCI6MTY2NTkwMzM4NCwiZXhwIjoxNjY4NDk1Mzg0fQ.gRsgXxdsdcvSXDVtDbql5w6Jp07SHxGOqzkKXrOLdnk",
              "user": {
                  "_id": "629cbcb2c29b1d7b99b71e77",
                  "name": "Betty",
                  "followers": [
                      {
                          "user": "6353efdcd9521f0232786fc0",
                          "_id": "6353f056d9521f0232786fcd",
                          "createdAt": "2022-10-22T13:29:58.256Z"
                      }
                  ],
                  "following": [
                      {
                          "user": "62923f05e8cbfe0e09efb65f",
                          "_id": "6352c29d670d0f4955200deb",
                          "createdAt": "2022-10-21T16:02:37.565Z"
                      }
                  ]
              }
            }
          ]
        }
      }
   * #swagger.responses[401] = {
        description: '你尚未登入！',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   * #swagger.responses[400] = {
      description: '回傳錯誤訊息',
      schema: {
        status: 400,
        message: '密碼不可小於 8 碼 / 密碼需英數混合 / 密碼不一致！'
      }
    }
   */
  '/updatePassword',isAuth, handleErrorAsync(userControl.patchUserPassword))

// 更新資料
router.patch(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '更新資料'
   * #swagger.description = '如為登入狀態，更新資料'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.parameters['body'] = {
      in: 'body',
      description: 'formdata 資料格式',
      schema: {
        name: "Betty",
        email: "betty@gmail.com"
      }
    }
   * #swagger.responses[200] = {
        description: '更新資料',
        schema: {
          status: "success",
          data: {
              "_id": "629cbcb2c29b1d7b99b71e77",
              "name": "Betty",
              "email": "betty@gmail.com",
              "followers": [
                  {
                      "user": "6353efdcd9521f0232786fc0",
                      "_id": "6353f056d9521f0232786fcd",
                      "createdAt": "2022-10-22T13:29:58.256Z"
                  }
              ],
              "following": [
                  {
                      "user": "62923f05e8cbfe0e09efb65f",
                      "_id": "6352c29d670d0f4955200deb",
                      "createdAt": "2022-10-21T16:02:37.565Z"
                  }
              ]
          }
        }
      }
   * #swagger.responses[401] = {
        description: '你尚未登入！',
        schema: {
          status: 401,
          message: '你尚未登入！'
        }
      }
   * #swagger.responses[400] = {
      description: '回傳錯誤訊息',
      schema: {
        status: 400,
        message: '名字不為空 / Email不為空'
      }
    }
   */
  '/profile',isAuth, handleErrorAsync(userControl.patchUserProfile));

// 取消追蹤
router.delete(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '取消追蹤'
   * #swagger.description = '如為登入狀態，取消追蹤'
   * #swagger.security = [{ apiKeyAuth: []}]
   *  #swagger.parameters['id'] = {
        in: 'path',
        description: '追隨ID',
      }
   * #swagger.responses[200] = {
        description: '取消追蹤',
        schema: {
          status: 'success',
          message: '您已成功取消追蹤！'
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
  '/:id/unfollow',isAuth,handleErrorAsync(userControl.deleteFollow));

// google 依賴 passport-google middleware
router.get(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = 'Google第三方登入'
   * #swagger.description = '跳轉至Google第三方登入'
  */
  '/google',passport.authenticate('google',{
  scope: ['email','profile'] // 需要資訊
}))

router.get(
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = 'Google第三方打回'
   * #swagger.description = 'Google第三方打回,路由帶資料'
   *  #swagger.parameters['token'] = {
        in: 'query',
        description: '帶回token',
      }
   *  #swagger.parameters['name'] = {
        in: 'query',
        description: '帶回name',
      }
  */
  '/google/callback',passport.authenticate('google',{
  session: false //前後端分離因次沒裝express-session
}),(req,res)=>{ //給前端資訊
  // res.send({
  //   status: true,
  //   data: req.user
  // })
  generateUrlJWT(req.user, res)
})

module.exports = router;
