/**
 * middleWare, function to interrupt requests and responses for 
 * autorization and authentication purposes
 */

const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
   const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401) //Unauthorized
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) =>{
            if(err) return res.sendStatus(403)//invalid token
            req.userID = decoded.sub
            next()
        }
    )

}

module.exports = verifyJWT