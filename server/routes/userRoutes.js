const express = require('express');
const { Routes } = require('react-router-dom');
const router = express.Router();
const usersController = require('../contollers/usersContoller');
const uploads = require('../middleware/upload2');


router.route('/')
     .get(usersController.getAllUsers)
     .post(uploads.single('avatar'), usersController.createNewUser)
     .patch(usersController.updateUser)
     .delete(usersController.deleteUser)
router.route('/usersByID')
     .get(usersController.getUsersByID)
     .patch(usersController.updateUser)
router.route('/updatePhoto')
     .post(uploads.single('newAvatar'), usersController.updateProfilePhoto)

module.exports = router