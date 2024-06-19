const express = require('express')
const router = express.Router()
const customerInfoInvoiceController = require('../contollers/customerInfoInvoiceController')

router.route('/')
      .post(customerInfoInvoiceController.createCustomerInvoiceInfo)
      .get(customerInfoInvoiceController.getCustomerInvoiceInfo)

module.exports = router