const mongoose = require('mongoose')

const moneyInDataSchema = new mongoose.Schema(
    {

        totalAmountIn: {
            type: String,
            required: true
        },
        amountRecieved: {
            type: String,
        },
        balanceDue: {
            type: Number
        },
        itemDescription: {
            type: String
        },
        modeOfPayment: {
            type: String,
            required: true
        },
        customerName: {
            type: String
        },
        customerContact: {
            type: Number
        },
        newItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NewItemsData'
        }],

        userID: {
            type: String
        }
    },

    {
        timestamps: true
    }

)
module.exports = mongoose.model('MoneyInData', moneyInDataSchema)