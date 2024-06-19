const mongoose = require('mongoose')

const customerInfoInvoiceSchema = new mongoose.Schema(
    {
        customerName: {
            type: String
        },
        customerPhoneNumber: {
            type: Number
        },
        customerAddress: {
            type: String,
        },
        customerState: {
            type: String
        },

    },

    {
        timestamps: true
    }

)
module.exports = mongoose.model('CustomerInfoInvoiceData', customerInfoInvoiceSchema)