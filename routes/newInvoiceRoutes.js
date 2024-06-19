const express = require('express')
const router = express.Router()
const newInvoiceController = require('../contollers/newInvoiceController')

router.route('/')
      .post(newInvoiceController.createNewInvoice)
      .get(newInvoiceController.getNewInvoice)
router.route('/:id')
      .get(newInvoiceController.getInvoiceById)
      .post(newInvoiceController.saveInvSentOutCount)
module.exports = router