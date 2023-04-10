const express = require('express');
const router = express.Router();
const uploadControl = require('../controllers/uploadControllers');
const upload = require('../service/image'); // middleware
const { isAuth } = require('../service/auth');
const handleErrorAsync = require("../service/handleErrorAsync");

router.post(
  /**
   * #swagger.tags = ['Upload']
   * #swagger.summary = '新增img圖片'
   * #swagger.description = '如為登入狀態，新增img圖片'
   * #swagger.security = [{ apiKeyAuth: []}]
   * #swagger.parameters['body'] = {
      in: 'body',
      description: 'formdata File',
      schema: {
        content: "1.png",
      }
    }
   * #swagger.responses[200] = {
      description: '新增img圖片',
      schema: {
        status: "success",
        imgUrl: "https://i.imgur.com/65HLuQ1.jpg"
      }
    }
   * #swagger.responses[400] = {
        description: '圖片不合比例',
        schema: {
          status: 400,
          message: '圖片不符合 1:1'
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
  '/', isAuth,upload, handleErrorAsync(uploadControl.postUpload));

module.exports = router;