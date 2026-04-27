const express = require('express')
// const {Router} = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouther = express.Router()
// const authRouther = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public 
 */
authRouther.post("/register",authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouther.post("/login",authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouther.get("/logout",authController.logoutUserController)

/**
 * @route GET api/auth/get-me
 * @description get the current loggedin user details
 * @access private
 */
authRouther.get("/get-me",authMiddleware.authUser,authController.getMeController)


module.exports = authRouther