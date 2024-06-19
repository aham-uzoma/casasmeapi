const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    default: true
  },
  phone_Number: {
    type: String,
    default: true
  },
  email: {
    type: String,
  },
  userID: {
    type: String,
  },
  avatar: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true
  },
  aboutUs: {
    type: String
  },

  refreshToken: String
})

module.exports = mongoose.model('User', userSchema)