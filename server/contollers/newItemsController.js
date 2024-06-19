const NewItemsData = require('../models/NewItemsData')
const asyncHandler = require('express-async-handler')

/**
 * The NewItems controller handles all CRUD Operations for newItems
 */

// @desc get newItems 
// @route GET /newItems
// @access Private
const getAllNewItems = asyncHandler(async (req, res) => {
    const userID = req.userID

    const newItemsData = await NewItemsData.find({ userID })

    if (!newItemsData?.length) {
        return res.status(400).json({ message: 'No rescent transaction' })
    }
    res.json(newItemsData)
})

//getOneItem
const getItemsById = asyncHandler(async (req, res) => {

    try {
        const { id } = req.params
        const itemById = await NewItemsData.findById(id)
        if (!itemById) {
            return res.status(400).json({ message: 'No rescent transaction' })
        }
        res.status(200).json(itemById)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })

    }
})

// @desc post newItems 
// @route POST /newItems
// @access Private

//This function was supposed to create NewItems but since Items are created through the 
//moneyIn channel this method is currently not utilized but left for educational
//and reference purposes.
const createNewItems = asyncHandler(async (req, res) => {
    const userID = req.userID
    const newItemsObj = req.body
    if (!newItemsObj) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const addNewItems = await NewItemsData.create(newItemsObj.newItemApiList);

    if (addNewItems) {//created
        res.status(201).json({ message: 'New Item Recorded' })

    } else {
        res.status(400).json({ message: 'Invalid Item' })
    }
})

//a different create method that utilizes different algorithmic pattern to achieve the same thing
//as createNewItems method above.
//This creates new Items through the inventory section of the app.
const createNewItems_product = asyncHandler(async (req, res) => {
    const userID = req.userID
    const { productName, costPrice, sellingPrice, unitOfQuantity, quantityCount, sellingPriceOfTotal } = req.body

    if (!productName || !costPrice || !sellingPrice
        || !unitOfQuantity || !quantityCount) {

        return res.status(400).json({ message: 'All fields are required' })
    }

    const productItemObj = { productName, costPrice, sellingPrice, unitOfQuantity, quantityCount, sellingPriceOfTotal, userID }//newItems


    const addNewItems = await NewItemsData.create(productItemObj)

    if (addNewItems) {//created
        res.status(201).json({ message: 'New Item Recorded' })

    } else {
        res.status(400).json({ message: 'Invalid Item' })
    }
})

// @desc update newItems 
// @route PATCH /newItems
// @access Private

//Updating only Item Quantity Count.
const updateNewItems = asyncHandler(async (req, res) => {
    const { itemId, itemCount, sellingPriceOfTotal } = req.body
    //confirm Data Existance
    if (!itemId || !itemCount) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    //find data to be updated with the help of the id
    const stockItem = await NewItemsData.findById(itemId).exec()
    if (!stockItem) {
        return res.status(400).json({ message: 'Item Not in Stock' })
    }

    //actual updating
    stockItem.quantityCount = itemCount
    stockItem.sellingPriceOfTotal = sellingPriceOfTotal
    const updatedItemCount = await stockItem.save()
    res.json({ message: `Stock Count updated to ${updatedItemCount.quantityCount} ` })
})

//Updating all Item Properties
const updateItemProperties = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        const updateItem = await NewItemsData.findByIdAndUpdate(id, req.body.stockDetails)
        if (!updateItem) {
            return res.status(404).json({ message: `cannot find product with ID of ${id}` })
        }
        const updatedItem = await NewItemsData.findById(id)
        res.status(200).json(updatedItem)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// @desc delete newItems 
// @route DELETE /newItems
// @access Private
const deleteNewItems = asyncHandler(async (req, res) => {
    const id = req.body

    if (!id || id.length === 0) {
        return res.status(400).json({ message: 'Items Id is required' })
    }

    const items = await NewItemsData.deleteMany({ _id: { $in: id } })

    if (!items) {
        return res.status(400).json({ message: 'Items does not exist' })
    }

    res.json({ message: 'Items has been deleted' })
})

module.exports = {
    getAllNewItems,
    createNewItems,
    updateNewItems,
    deleteNewItems,
    createNewItems_product,
    getItemsById,
    updateItemProperties

}
