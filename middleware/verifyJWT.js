const jwt = require('jsonwebtoken');

const verifyJWT = (req,res,next) => {    
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(401).send("unauthorized access");
    }    
    const token = authHeader.split(' ')[1];
    // console.log(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, result) => {            
            if(err) return res.sendStatus(403); //invalid token
            req.user = result.email;
            next();
        }
    )
}
module.exports = verifyJWT