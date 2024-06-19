const NewInvoiceData = require('../models/NewInvoiceData')
const asyncHandler = require('express-async-handler')

/**
 * NewInvoice controller, handles all CRUD oprations for newInvoices.
 */

const createNewInvoice = asyncHandler(async (req, res) => {
    const { invoiceDate, invoiceDueDate, newInvoiceItemm, currentCustomer } = req.body
    const userID = req.userID

    if (!invoiceDate || !invoiceDueDate || !newInvoiceItemm || !currentCustomer) {
        return res.status(400).json({ message: 'All fields are required' })

    }

    const newInvoiceObj = { invoiceDate, invoiceDueDate, newInvoiceItemm, currentCustomer, userID }

    const addNewInvoice = await NewInvoiceData.create(newInvoiceObj)
    // Given start and end dates as ISO strings
    const startDate = new Date(addNewInvoice.invoiceDate);
    const endDate = new Date(addNewInvoice.invoiceDueDate);

    // Calculate the difference in milliseconds
    const timeDifference = endDate - startDate;

    // Convert milliseconds to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    addNewInvoice.daysDifference = daysDifference
    await addNewInvoice.save()

    if (addNewInvoice) {//created
        res.status(201).json({ message: 'New Item Recorded' })
        console.log(addNewInvoice)

    } else {
        res.status(400).json({ message: 'Invalid Item' })
    }
})

const getNewInvoice = asyncHandler(async (req, res) => {
    const userID = req.userID
    const newInvoiceData = await NewInvoiceData.find({ userID })

    try {
        if (!newInvoiceData) {
            return res.status(400).json({ message: "Such Data does not exist" })
        }
        res.json(newInvoiceData)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }

})

//save the number of invoice sentOut
const saveInvSentOutCount = async (req, res) => {
    try {

        const { sentOutInvCount } = req.body
        const userID = req.userID
        const { id } = req.params
        if (!sentOutInvCount || !id) {
            return res.status(400).json({ message: 'All field is required' })
        }

        const invoiceById = await NewInvoiceData.findById(id).exec()

        if (!invoiceById) {
            return res.status(400).json({ message: 'invoice Data does not exist' })
        }
        if (invoiceById.newInvoiceItemm[0].hasOwnProperty('sentOutInvCount')) {
            invoiceById.newInvoiceItemm[0].sentOutInvCount += sentOutInvCount;
        } else {
            invoiceById.newInvoiceItemm[0].sentOutInvCount = sentOutInvCount;
        }
        const updatedInvoice = await invoiceById.save()
        res.json({ message: 'Sent out invoice Updated' })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params
        const invoiceById = await NewInvoiceData.findById(id)
        if (!invoiceById) {
            return res.status(400).json({ message: 'No rescent invoice Data found' })
        }
        res.status(200).json(invoiceById)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })

    }
}

module.exports = {
    createNewInvoice,
    getNewInvoice,
    getInvoiceById,
    saveInvSentOutCount
}