const express = require('express');
const router = express.Router();
const authentication = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../model/users');

router.post('/login',authentication.login);
router.post('/register',authentication.register);

router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }),
async function(req, res){
  console.log("getting oauth token");
});
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  async function(req, res) {
    console.log('token received ')
    const refreshToken = jwt.sign(
      { "id":req.user.id },
      process.env.REFRESH_TOKEN_SECRET,  
      {expiresIn: '1d'}
  );
    // console.log(req.user.id);
    await User.updateOne({_id:req.user.id},{$set:{refreshToken}});
    res.cookie('jwt',refreshToken, {httpOnly: true, maxAge: 24*60*60*1000, sameSite:'none', secure: true});
    // Successful authentication, redirect home. 
    res.redirect('http://localhost:5173/dashboard');
  });

module.exports = router;