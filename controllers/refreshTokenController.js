const User = require('../model/users');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(401).send('Unauthorized'); 
    const refreshToken = cookies.jwt;
    const result = await User.findOne({refreshToken}).exec();
    if(!result) return res.status(403).send('not found'); 
    // console.log(result._id);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded) => {
            if(err /*|| result.id !== decoded.id*/) return res.status(403).send('invalid token');
            
            const accessToken = jwt.sign(                
                {"id": decoded.id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1h'}                
            );
            
            const resCred = {username:result.username,email:result.email}
            res.status(200).json({resCred,accessToken});
        }
    )
}
module.exports = {handleRefreshToken}