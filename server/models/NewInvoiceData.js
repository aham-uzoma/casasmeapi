const mongoose = require('mongoose')

const newInvoiceSchema = new mongoose.Schema(
    {

        invoiceDate: {
            type: String,
            required: true
        },
        invoiceDueDate: {
            type: String,
            required: true
        },
        currentCustomer: {
            customerName: { type: String },
            customerPhoneNumber: { type: Number },
            customerAddress: { type: String },
            customerState: { type: String },
        },
        newInvoiceItemm: [{
            productName: { type: String },
            sellingPrice: { type: Number },
            vaTaxPercent: { type: Number },
            vaTaxValue: { type: Number },
            totalPriceCount: { type: Number },
            unitOfMeasurement: { type: String },
            quantity: { type: Number },
            sentOutInvCount: { type: Number }

        }],
        daysDifference: {
            type: String
        },

        userID: {
            type: String,
        }

    },

    {
        timestamps: true
    }

)
module.exports = mongoose.model('NewInvoiceData', newInvoiceSchema)