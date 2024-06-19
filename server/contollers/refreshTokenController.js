const User = require('../models/User')
const jwt = require('jsonwebtoken')

/**
 * Generates a new accessToken upon request but first has to verify jwt.verify(...) 
 * the refreshToken if it matches before generateing the accessToken using
 * jwt.sign(....), then passes the new accessToken alongside username as JSON to the frontend
 */

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.sendStatus(401) //unauthorized jwt
  const refreshToken = cookies.jwt

  const foundUserData2 = await User.findOne({ refreshToken }).exec()
  if (!foundUserData2) return res.sendStatus(403)//Forbidden

  //evaluate JWT
  jwt.verify(refreshToken, process.env.REFERESH_TOKEN_SECRET,
    (err, decoded) => {

      if (err || foundUserData2._id.toString() !== decoded.sub) return res.sendStatus(403);//forbidden

      //another accessToken is created

      const username = foundUserData2.username
      const accessToken = jwt.sign(
        { 'sub': decoded.sub }, // {'username':decoded.username}, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '40s' }
      )
      res.json({ accessToken, username })
    })

}
module.exports = { handleRefreshToken }