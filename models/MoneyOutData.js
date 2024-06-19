const mongoose = require('mongoose')

const moneyOutDataSchema = new mongoose.Schema(
    {

        totalAmtOut: {
            type: String,
            required: true
        },
        amtPaid: {
            type: String,
        },
        dueBalance: {
            type: Number
        },
        description: {
            type: String
        },
        serviceCategory: {
            type: String,
        },
        supplierName: {
            type: String
        },
        supplierContact: {
            type: Number
        },
        newMoneyOutItem: [{
            product_service: { type: String },
            cost_price: { type: Number },
            unitsOfItem: { type: String },
            totalCostPriceCount: { type: Number },
            item_quantity: { type: Number },
        }],

        userID: {
            type: String
        }
    },

    {
        timestamps: true
    }

)
module.exports = mongoose.model('MoneyOutData', moneyOutDataSchema)