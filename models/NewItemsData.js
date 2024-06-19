const mongoose = require('mongoose');

const newItemsSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true,
        unique: true
    },
    sellingPriceOfTotal: {
        type: String,
    },
    quantityCount: {
        type: Number,
    },
    selectedQtyNumber: {
        type: Number,
    },
    unitOfQuantity: {
        type: String,
    },
    costPrice: {
        type: Number,
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    moneyInData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MoneyInData'
    },
    userID: {
        type: String,
    }

})

module.exports = mongoose.model('NewItemsData', newItemsSchema);