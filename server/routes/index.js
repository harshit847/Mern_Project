const express = require('express')
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetils = require('../controller/updateUserDetails')
const searchUser = require('../controller/searchUser')

const router = express.Router()

//create user api
router.post('/register',registerUser)
//check user email
router.post('/email',checkEmail)
//check user Password
router.post('/password',checkPassword)
//login user details
router.get('/user-details',userDetails)
//logout details
router.get('/logout',logout)
//update user details
router.post('/update-user',updateUserDetils)
//search user
router.post("/search-user",searchUser)

module.exports = router;
