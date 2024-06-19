const express = require('express')
const router = express.Router()
const moneyOutController = require('../contollers/moneyOutController')

router.route('/')
      .post(moneyOutController.createMoneyOutTransact)
      .get(moneyOutController.getAllMoneyOutTransact)
router.route('/moneyOutByDate')
      .get(moneyOutController.getMoneyOutDaily)
router.route('/moneyOutByMonth')
      .get(moneyOutController.getMoneyOutByMonth)
router.route('/moneyOutByYear')
      .get(moneyOutController.getMoneyOutByYear)

module.exports = router