# 雲端 Heroku-API

## 套件
* express-generator
* dotenv
* mongoose
### 驗證
* bcryptjs
* jsonwebtoken 
* validator
### 圖片
* imgur
* image-size
* multer

----------------------------------------------------------------

## 架構
* controllers 方法
* handler (舊的寫法)
* models 資料庫-Schema
* routes 路由
  * posts
  * upload
  * users
* service 共用服務
* views (無-此專案只有後端)
----------------------------------------------------------------
## API
* posts
  * getPosts
  * getPost
  * getUserComment
  * postPost
  * postComment
  * postLike
  * deleteLike
* users
  * getAllUsers
  * getUserProfile
  * getUserFollowing
  * getLikeList
  * postUserSignIn
  * postUserSignUp
  * postFollow
  * patchUserPassword
  * patchUserProfile
  * deleteFollow
  * getGoogleLogin
* upload
  * postUpload
