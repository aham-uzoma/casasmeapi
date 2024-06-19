const ItemsInvoiceData = require('../models/ItemsInvoiceData')
const asyncHandler = require('express-async-handler')

/**
 * This Code is No Longer in Use in this app but left for educational and reference purposes
 */

const createItemsInvoiceInfo = asyncHandler(async (req, res) => {
    const { newInvoiceItemm } = req.body

    if (!Array.isArray(newInvoiceItemm) || !newInvoiceItemm.length) {

        return res.status(400).json({ message: 'All fields are required' })
    }

    const addItemsInvoiceInfo = await ItemsInvoiceData.create(newInvoiceItemm)

    if (addItemsInvoiceInfo) {//created
        res.status(201).json({ message: 'New customer Invoice Recorded' })

    } else {
        res.status(400).json({ message: 'Invalid Item' })
    }
})

const getItemInvoiceInfo = asyncHandler(async (req, res) => {
    const itemsInvoiceData = await ItemsInvoiceData.find().exec()
    try {
        if (!itemsInvoiceData) {
            return res.status(400).json({ message: "Such Data does not exist" })
        }
        res.json(itemsInvoiceData)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }

})

module.exports = {
    createItemsInvoiceInfo,
    getItemInvoiceInfo
}