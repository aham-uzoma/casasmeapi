const MoneyInData = require('../models/MoneyInData')
const asyncHandler = require('express-async-handler')
const NewItemsData = require('../models/NewItemsData')

/**
 * MoneyIn Controller handles all CRUD operation for 
 * moneyIn/Credit transactions
 */


// @desc get MoneyIn Transaction
// @route GET '/moneyIn'
// @access Private
const getAllMoneyInTransact = asyncHandler(async (req, res) => {
    const userID = req.userID

    const creditTransact = await MoneyInData.find({ userID: userID }).select().lean()

    if (!creditTransact?.length) {
        return res.status(400).json({ message: 'No rescent transaction' })
    }
    res.json(creditTransact)

})

// GET'/newMoneyInRow'
const getMoneyInNewItems = async (req, res) => {
    const userID = req.userID
    try {

        const moneyInNewItems = await MoneyInData.find({ userID }).select('newItems').populate('newItems').exec()
        if (!moneyInNewItems) {
            return res.status(400).json({ message: 'Such data does not exist' })
        }
        res.json(moneyInNewItems)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

// @desc get MoneyIn Transaction
// @route GET '/balanceDue'
// @access Private

//get data daily
const getAllMoneyInTransactByDate = asyncHandler(async (req, res) => {
    const userID = req.userID
    let startDate = new Date()
    let endDate = new Date()

    startDate.setHours(0)
    endDate.setHours(24)

    const result = await MoneyInData.find(
        {
            userID: userID,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }
    ).select('totalAmountIn').exec()

    if (!result?.length) {
        return res.status(400).json({ message: 'No rescent transaction' })
    }
    res.json(result)

})

//get moneyIn data by month
const getMoneyInByMonth = async (req, res) => {
    const userID = req.userID

    try {

        var date = new Date();
        var firstDateOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        var endDateOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        let startDate = firstDateOfCurrentMonth
        let endDate = endDateOfCurrentMonth

        const moneyInByMonth = await MoneyInData.find(
            {
                userID: userID,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        ).select('totalAmountIn').exec()

        if (!moneyInByMonth?.length) {
            return res.status(400).json({ message: 'No rescent transaction' })
        }
        res.json(moneyInByMonth)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.messsage })
    }
}

//get moneyIn Transaction by year
const getMoneyInByYear = async (req, res) => {
    const userID = req.userID
    try {

        var date = new Date()
        var firstDateOfCurrentYear = new Date(date.setMonth(0, 1))
        var endDateOfCurrentYear = new Date(date.setMonth(11, 31))

        const moneyInByYear = await MoneyInData.find(
            {
                userID: userID,
                createdAt: {
                    $gte: firstDateOfCurrentYear,
                    $lte: endDateOfCurrentYear,
                },

            }
        ).populate('newItems').exec();

        if (!moneyInByYear?.length) {
            return res.status(400).json({ message: 'No rescent transaction' })
        }
        res.json(moneyInByYear)

    } catch (error) {
        console.log(error)
        res.staus(500).json({ message: error.message })
    }
}

//getBalanceDueData on a monthly basis
const getAllMonthlyBalanceDue = async (req, res) => {
    const userID = req.userID

    try {

        var date = new Date();
        var firstDateOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        var endDateOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        let startDate = firstDateOfCurrentMonth
        let endDate = endDateOfCurrentMonth

        const balanceDueByMonth = await MoneyInData.find(
            {
                userID: userID,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        ).select('balanceDue').exec()

        if (!balanceDueByMonth?.length) {
            return res.status(400).json({ message: 'No rescent transaction' })
        }
        res.json(balanceDueByMonth)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.messsage })
    }

}

// @desc create MoneyIn Transaction
// @route POST /moneyIn
// @access Private

//creating new MoneyIn Transaction at the same time creating new 
//newItem in the NewItemsDatabase.
const createMoneyInTransact = asyncHandler(async (req, res) => {

    const { totalAmountIn, amountRecieved, balanceDue, itemDescription, customerName, customerContact, modeOfPayment } = req.body//newItems
    const { newItems } = req.body
    const userID = req.userID
    //confirm data
    if (!totalAmountIn || !modeOfPayment) {

        return res.status(400).json({ message: 'All fields are required' })
    }

    const moneyInObj = { totalAmountIn, amountRecieved, balanceDue, itemDescription, customerName, customerContact, modeOfPayment, userID }//newItems

    const newCreditTransact = await MoneyInData.create(moneyInObj)

    const newItemsObj = newItems.map(items => ({ ...items, userID }))

    const productNames = newItemsObj.map(obj => obj.productName)

    const duplicate = await NewItemsData.find({ productName: { $in: productNames } });// search duplicates using productName

    console.log(duplicate)

    const create_newItems = []
    if (Array.isArray(duplicate) && duplicate.length === 0) {
        console.log('no duplicates')
        const newItems_create = await NewItemsData.create(newItemsObj)
        create_newItems.splice(0, create_newItems.length, ...newItems_create)
        console.log(create_newItems)

        //loop through the create_newUniqueItems array of Objects and extract the id
        //of each object and create another array using map()
        const newItemsArray = create_newItems.map((item) => item._id)

        //update MoneyIn Transaction
        newCreditTransact.newItems.splice(0, newItemsObj.length, ...newItemsArray)
        newCreditTransact.save()

    } else {
        console.log('duplicate exists')

        const updatedItems = newItemsObj.map((item) => {
            let index = duplicate.findIndex(el => el.productName === item.productName)
            if (index !== -1) {
                item.quantityCount = item.remainingQuantity
                item.sellingPriceOfTotal = item.remainingQuantity * item.sellingPrice
            }
            return item
        })

        const newUpdatedItemArr = []

        for (const item of updatedItems) {

            const newUpdatedItem = await NewItemsData.findOneAndUpdate(
                { productName: item.productName },
                { $set: item },
                { upsert: true, returnDocument: 'after' }
            )

            newUpdatedItemArr.push(newUpdatedItem._id)
        }

        newCreditTransact.newItems.splice(0, newItemsObj.length, ...newUpdatedItemArr)
        newCreditTransact.save()

    }

    if (newCreditTransact) {
        res.status(201).json({ message: 'New credit Transaction Recorded' })
    }
    else {
        res.status(400).json({ message: 'Invalid credit Transaction' })
    }

})

// @desc update MoneyIn Transaction
// @route patch /moneyIn
// @access Private
const updateMoneyInTransact = asyncHandler(async (req, res) => { })

// @desc update MoneyIn Transaction
// @route patch /moneyIn
// @access Private
const deleteMoneyInTransact = asyncHandler(async (req, res) => { })

module.exports = {
    getAllMoneyInTransact,
    createMoneyInTransact,
    updateMoneyInTransact,
    deleteMoneyInTransact,
    getAllMoneyInTransactByDate,
    getMoneyInNewItems,
    getMoneyInByMonth,
    getAllMonthlyBalanceDue,
    getMoneyInByYear

}


