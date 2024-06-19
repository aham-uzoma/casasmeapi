const asyncHandler = require('express-async-handler')
const MoneyOutData = require('../models/MoneyOutData')

/**
 * MoneyOut Controller handles all CRUD operation for 
 * moneyOut/Debit transactions
 */

const createMoneyOutTransact = asyncHandler(async (req, res) => {
    const userID = req.userID

    const { totalAmtOut, amtPaid, dueBalance, description, serviceCategory,
        supplierName, supplierContact, newMoneyOutItem } = req.body

    if (!totalAmtOut || !amtPaid ||
        !supplierName || !supplierContact) {

        return res.status(400).json({ message: 'All fields are required' })
    }

    const moneyOutDataObj = {
        totalAmtOut, amtPaid, dueBalance, description, serviceCategory,
        supplierName, supplierContact, newMoneyOutItem, userID
    }


    const moneyOutTransact = await MoneyOutData.create(moneyOutDataObj);
    if (moneyOutTransact) {
        res.status(201).json({ message: 'New transaction Recorded' })
        console.log(moneyOutTransact)
    } else {
        res.status(400).json({ message: 'Invalid data' })
    }
})

const getAllMoneyOutTransact = asyncHandler(async (req, res) => {
    const userID = req.userID

    const newMoneyOutData = await MoneyOutData.find({ userID: userID })

    if (!newMoneyOutData?.length) {
        return res.status(400).json({ message: 'No rescent transaction' })
    }
    res.json(newMoneyOutData)
})

//get MoneyOut Data by month
const getMoneyOutByMonth = async (req, res) => {
    const userID = req.userID

    try {

        var date = new Date();
        var firstDateOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        var endDateOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        let startDate = firstDateOfCurrentMonth
        let endDate = endDateOfCurrentMonth

        const moneyOutByMonth = await MoneyOutData.find(
            {
                userID: userID,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        ).select('totalAmtOut').exec()

        if (!moneyOutByMonth?.length) {
            return res.status(400).json({ message: 'No rescent transaction' })
        }
        res.json(moneyOutByMonth)


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

//get MoneyOut Data by date i.e daily
const getMoneyOutDaily = async (req, res) => {
    const userID = req.userID

    try {
        let startDate = new Date()
        let endDate = new Date()

        startDate.setHours(0)
        endDate.setHours(24)

        const result = await MoneyOutData.find(
            {
                userID: userID,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        ).select('totalAmtOut').exec()

        if (!result?.length) {
            return res.status(400).json({ message: 'No rescent transaction' })
        }
        res.json(result)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

//get moneyOut Transaction by year
const getMoneyOutByYear = async (req, res) => {
    const userID = req.userID

    try {

        var date = new Date()
        var firstDateOfCurrentYear = new Date(date.setMonth(0, 1))
        var endDateOfCurrentYear = new Date(date.setMonth(11, 31))

        const moneyOutByYear = await MoneyOutData.find(
            {
                userID: userID,
                createdAt: {
                    $gte: firstDateOfCurrentYear,
                    $lte: endDateOfCurrentYear,
                },

            }
        );
        console.log(moneyOutByYear)

        if (!moneyOutByYear?.length) {
            return res.status(400).json({ message: 'No rescent transaction' })
        }
        res.json(moneyOutByYear)

    } catch (error) {
        console.log(error)
        res.staus(500).json({ message: error.message })
    }
}

module.exports = {
    createMoneyOutTransact,
    getAllMoneyOutTransact,
    getMoneyOutDaily,
    getMoneyOutByMonth,
    getMoneyOutByYear,
}