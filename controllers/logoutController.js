const User = require('../model/users');
const jwt = require('jsonwebtoken');
const {Octokit} = require('@octokit/rest');

const handleLogout= async (req, res) => {
  
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); 

    const refreshToken = cookies.jwt;
    const result = await User.findOne({refreshToken}).exec();
    if(!result){
        res.clearCookie('jwt', {httpOnly: true, maxAge: 24*60*60*1000, sameSite:'none', secure: true});
        return res.sendStatus(204);
    }
    await User.updateOne({email:result.email},{$set:{refreshToken:''}});
    res.clearCookie('jwt', {httpOnly: true, maxAge: 24*60*60*1000, sameSite:'none', secure: true});
    res.sendStatus(200);
}
module.exports = {handleLogout}