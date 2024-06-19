const express = require('express')
const router = express.Router()
const logOutController = require('../contollers/logOutContoller')

router.get('/', logOutController.handleLogOut)

module.exports = router