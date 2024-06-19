const mongoose = require('mongoose')

const itemsInvoiceSchema = new mongoose.Schema(
    {
        productName: {
            type: String
        },
        sellingPrice: {
            type: Number
        },
        vaTaxPercent: {
            type: Number
        },
        vaTaxValue: {
            type: Number
        },
        totalPriceCount: {
            type: Number
        },
        unitOfMeasurement: {
            type: String
        },
        quantity: {
            type: Number
        },

    },

    {
        timestamps: true
    }

)
module.exports = mongoose.model('ItemsInvoiceData', itemsInvoiceSchema)