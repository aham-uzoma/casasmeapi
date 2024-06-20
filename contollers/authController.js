const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * The authController manages user authentication procees,creates and 
 * manupulates the JWT, both referesh and accesstoken.
 */

const handleUserLogIn = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ 'message': 'username or password is required' })//Bad Request

  const foundUserData = await User.findOne({ username }).exec();

  if (!foundUserData) return res.sendStatus(401)//Unauthorized

  const validPassword = await bcrypt.compare(password, foundUserData.password)
  if (!validPassword) {
    return res.sendStatus(401)//Unauthorized
  } else {
    //create the JWT
    const accessToken = jwt.sign({ 'sub': foundUserData._id },
      process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s' })
    const refreshToken = jwt.sign({ 'sub': foundUserData._id },
      process.env.REFERESH_TOKEN_SECRET, { expiresIn: '1d' })

    //save refreshToken with current user
    foundUserData.refreshToken = refreshToken
    const result = await foundUserData.save()

    //create a secured cookie with refreshToken
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 86400000, secure: true, sameSite: 'Strict' }) //secure: true

    //Send access Token to user
    res.json({ accessToken })
  }

}

module.exports = { handleUserLogIn }
