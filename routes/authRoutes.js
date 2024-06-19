const express = require('express')
const router = express.Router()
const authController = require('../contollers/authController')

router.route('/')
      .post(authController.handleUserLogIn)

module.exports = router