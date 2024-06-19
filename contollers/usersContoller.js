const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

/**
 * User Controller Facilitates all user CRUD Operations
 * user can also be a Business
 */

// @desc GET all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
   const users = await User.find().select('-password').lean()
   if (!users?.length) {
      return res.status(400).json({ message: 'No Users Found' })
   }
   res.json(users)
})

const getUsersByID = asyncHandler(async (req, res) => {
   const userID = req.userID
   const users = await User.find({ userID }).select('-password').lean()
   if (!users?.length) {
      return res.status(400).json({ message: 'No Users Found' })
   }
   res.json(users)
})

// @desc Create new user
// @user Registration
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {

   const { username, password, businessName, phone_Number, email } = req.body

   //confirming data
   if (!username || !password || !businessName || !phone_Number || !email) {
      return res.status(400).json({ message: 'All fields are required' })
   }

   //check for duplicate
   const duplicate = await User.findOne({ username }).lean().exec()

   if (duplicate) {
      return res.status(409).json({ message: 'Username already Exists' })
   }

   //Hash Password
   const hashedPassword = await bcrypt.hash(password, 10)//salt Rounds
   const userObject = { username: username, password: hashedPassword, businessName, phone_Number, email, avatar: req.file.filename }
   //create and store new user
   const userr = await User.create(userObject)

   //match the automatically generated id _id with the userID field.   
   userr.userID = userr._id
   const user = await userr.save()

   if (user) {//created
      res.status(201).json({ status: true, message: `New user ${username} created` })
   } else {
      res.status(400).json({ message: 'invalid userdata recieved' })
   }

})

const updateUser = asyncHandler(async (req, res) => {
   try {
      const userID = req.userID
      const updateUserData = await User.findByIdAndUpdate(userID, req.body.businessData)
      if (!updateUserData) {
         return res.status(404).json({ message: 'Business Details have been updated' })
      }
      const updatedUserData = await User.findById(userID)
      res.status(200).json(updatedUserData)

   } catch (error) {
      res.status(500).json({ message: error.message })
   }
})

const updateProfilePhoto = asyncHandler(async (req, res) => {
   try {
      const userID = req.body.userID
      const user = await User.findById(userID).exec()
      if (!user) {
         return res.status(400).json({ message: 'user details not found' })
      }
      user.avatar = req.file.filename
      const updatedUser = await user.save()
      res.json({ message: `${updatedUser.businessName} updated` })

   } catch (error) {
      res.status(500).json({ message: error.message })
   }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUserr = asyncHandler(async (req, res) => {
   const { businessName, aboutUs, phone_Number, email } = req.body
   const userID = req.userID
   const user = await User.findById(userID).exec()
   if (!user) {
      return res.status(400).json({ message: 'user details not found' })
   }

   user.businessName = businessName
   user.aboutUs = aboutUs
   user.phone_Number = phone_Number
   user.email = email

   const updatedUser = await user.save()
   res.json({ message: `${updatedUser.businessName} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
   const { id } = req.body
   if (!id) {
      return res.status(400).json({ message: 'User ID Required' })
   }
   const user = await User.findById(id).exec()
   if (!user) {
      return res.status(400).json({ message: 'User not found' })
   }

   const result = await user.deleteOne()

   const reply = `Username ${result.username} with ID ${result._id} deleted`

   res.json(reply)
})

module.exports = {
   getAllUsers,
   createNewUser,
   updateUser,
   deleteUser,
   getUsersByID,
   updateUserr,
   updateProfilePhoto,
}