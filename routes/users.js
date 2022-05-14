const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

/* GET users listing. */
router.get('/', handleErrorAsync(
  async (req, res) => {
    const users =await User.find({});
    res.status(200).json({status:"success", data:users})
  }
));

router.post('/', handleErrorAsync(
  async (req, res, next) => {
    const data =req.body
    if(!data.name || !data.email){
      return next(appError(400,"名字/Email為必填",next))
    }

    const newUser =await User.create({
      name: data.name,
      email: data.email,
      photo: data.photo
    });
    res.status(200).json({status:"success", data:newUser})
  }
));

router.delete('/', handleErrorAsync(
  async (req, res) => {
    await User.deleteMany({});
    res.status(200).json({status:"success", data:[]})
  }
));

router.delete('/:id', handleErrorAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const resultUser = await User.findByIdAndDelete(id);
    if(resultUser == null){
      return next(appError(400,"查無此id",next))
    }
    const users =await User.find({});
    res.status(200).json({status:"success", data:users})
  }
));

router.patch('/:id', handleErrorAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const data = req.body
    const newArray = Object.keys(data)

    if(newArray.includes('name') && !data.name){
      return next(appError(400,"名字不為空",next))
    }else if(newArray.includes('email') && !data.email){
      return next(appError(400,"Email不為空",next))
    }

    const resultUser = await User.findByIdAndUpdate(id,data);
    if(resultUser == null){
      throw '查無此id'
    }

    const newData =await User.findById(id);
    res.status(200).json({status:"success", data:newData})
  }
));
module.exports = router;
