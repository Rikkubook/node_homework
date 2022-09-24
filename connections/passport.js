const passport =require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User =require('../models/usersModel');
const bcrypt = require('bcryptjs')
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // 改成env
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // 改成env
  callbackURL: process.env.CALLBACKURL
},
async function(accessToken, refreshToken, profile, cb) {
  // console.log('profile',profile)
  const user = await User.findOne({googleId: profile.id})
  if(user){
    console.log('使用者已存在')
    return cb(null, user)
  }
  
  const password = await bcrypt.hash('K10werwedsfsdf',12)
  const newUser = await User.create({
    email: profile.emails[0].value,
    name: profile.displayName,
    password,
    googleId: profile.id
  })
  return cb(null, newUser) //會回傳給 callback
}
));