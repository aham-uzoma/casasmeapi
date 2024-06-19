const CustomerInfoInvoiceData = require('../models/CustomerInfoInvoiceData')
const asyncHandler = require('express-async-handler')

/**
 * This code is no longer in use in this app but left for educational and reference purposes.
 */

const createCustomerInvoiceInfo = asyncHandler(async (req, res) => {
    const { customerName, customerPhoneNumber, customerAddress, customerState } = req.body

    if (!customerName || !customerPhoneNumber || !customerAddress || !customerState) {

        return res.status(400).json({ message: 'All fields are required' })
    }

    const customerInvoiceObj = { customerName, customerPhoneNumber, customerAddress, customerState }


    const addCustomerInvoiceInfo = await CustomerInfoInvoiceData.create(customerInvoiceObj)

    if (addCustomerInvoiceInfo) {
        res.status(201).json({ message: 'New customer Invoice Recorded' })
    } else {
        res.status(400).json({ message: 'Invalid Item' })
    }
})
const getCustomerInvoiceInfo = asyncHandler(async (req, res) => {
    const customerInvoiceData = await CustomerInfoInvoiceData.find().exec()
    try {
        if (!customerInvoiceData) {
            return res.status(400).json({ message: "Such Data does not exist" })
        }
        res.json(customerInvoiceData)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }

})

module.exports = {
    createCustomerInvoiceInfo,
    getCustomerInvoiceInfo
}