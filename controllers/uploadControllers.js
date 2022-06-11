const appError = require("../service/appError");
const sizeOf = require('image-size'); // 圖片大小
const { ImgurClient } = require('imgur'); // IMGUR

const uploadControl ={
  postUpload:  
    async (req, res, next)=> {
      if(!req.files.length) {
        return next(appError(400,"未上傳檔案",next));
      }
      // 驗證圖片
      const dimensions = sizeOf(req.files[0].buffer);
      if(dimensions.width !== dimensions.height) {
        return next(appError(400,"圖片不符合 1:1 ",next)) // image-size 檔案1:1
      }
      // 上傳圖片
      const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENTID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN,
      });
      const response = await client.upload({
        image: req.files[0].buffer.toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID
      });
      //console.log(response) // 取得imgur給的資料
      res.status(200).json({
          status:"success",
          imgUrl: response.data.link
      })
    }
}

module.exports = uploadControl;