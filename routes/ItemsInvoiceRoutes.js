const express = require('express')
const router = express.Router()
const itemsInvoiceController = require('../contollers/itemsInvoiceController')

router.route('/')
      .post(itemsInvoiceController.createItemsInvoiceInfo)
      .get(itemsInvoiceController.getItemInvoiceInfo)


module.exports = router