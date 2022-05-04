const express = require('express');
const router = express.Router();
const Post = require('../models/postModel')
const Like = require('../models/likesModel')
const { successHandler, errorHandler } = require('../handler');


router.get('/', async (req, res) => {
  // http://localhost:3005/posts?timeSort=asc&search=0
  const timeSort = req.query.timeSort == 'asc'? 1:-1
  // console.log(req.query.search == false)
  const search = req.query.search? {"content": new RegExp(req.query.search)} : {}; //== undefined??? 空字串
  try{
    const posts =await Post.find(search).populate({ //此是先將name編譯,可以不編譯只算長度
      path: 'userInfo',
      select: 'name photo'
    }).sort({'createAt': timeSort})  //1 由小到大
    successHandler(res, posts)
  }catch(error){
    errorHandler(res,error,400)
  }
});

//https://mongoosejs.com/docs/populate.html#populate_multiple_documents

router.post('/', async (req, res) => {
  try{
    const data = req.body
    if(!data.userInfo || !data.content ){
      throw '名稱、內文、缺一不可'
    }
    const newPost = await Post.create({
        userInfo: data.userInfo,
        image: data.image,
        content: data.content,
        likes: data.likes,
        comments: data.comments,
        createdAt: data.createdAt,
      })
    successHandler(res, newPost)
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.delete('/', async (req, res) => {
  try{
    await Post.deleteMany({});
    successHandler(res, [])
  }catch(error){
    errorHandler(res,error,400)
  }
});


//----------------------------------------------------------------
router.post('/postLikes', async (req, res) => {
  try{
    const data = req.body
    if(!data.userInfo || !data.posts ){
      throw '使用者Id、喜歡文章、缺一不可'
    }

    const user = await Like.findOne({"userInfo": data.userInfo})
    if(user){
      if(user.posts.includes(data.posts)){ //為了修改排序
        const index = like.posts.indexOf(data.posts)
        console.log(index)
        user.posts.splice(index, 1) 
      }
      user.posts.unshift(data.posts) 
      user.save()
      successHandler(res, user)
      // https://mongoosejs.com/docs/api/array.html#mongoosearray_MongooseArray-addToSet
    }else{
      const newLike = await Like.create({
        userInfo: data.userInfo,
        posts: [data.posts],
      })
      successHandler(res, newLike)
    }
  }catch(error){
    errorHandler(res,error,400)
  }
});

router.post('/likes', async (req, res) => {
  try{
    const data = req.body
    if(!data.userInfo ){
      throw '名稱缺少'
    }

    const likes = await Like.findOne({"userInfo": data.userInfo})
    .populate({ //此是先將userInfo 編譯
      path: 'userInfo',
      select: 'name photo'
    }).populate({ //此是先將posts 編譯
      path: 'posts',
      select: 'name content createAt'
    })

    successHandler(res, likes)
  }catch(error){
    errorHandler(res,error,400)
  }
});
module.exports = router;
