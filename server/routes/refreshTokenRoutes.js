const express = require('express')
const router = express.Router()
const refreshTokenContoller = require('../contollers/refreshTokenController')

router.get('/',refreshTokenContoller.handleRefreshToken)

module.exports = router;