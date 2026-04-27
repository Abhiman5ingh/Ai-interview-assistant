const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

 /**
 * @name reqisterUserController 
 * @description register a new user, expects username, email and password in the request.body
 * @access Public
 */

async function registerUserController(req, res){

    const {username, email, password} = req.body    // destructing

    if(!username || !email ||!password){
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username},{email}]
    })

    if(isUserAlreadyExists){
        /* isUserAlreadyExists.username == username */
        return res.status(400).json({
            message: "Account already exists witht this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User resgistered successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
 }

 /**
  * @name loginUserController 
  * @description login a user, expects username, email and password in the request.body
  * @access Public
  */

async function loginUserController(req, res){
    
    const{ email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password)

    if(!isPasswordvalid){
        return res.status(400).json({
            message: "Invalid eamil or password"
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)
    res.status(200).json({
        message:"User loggedIn successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController 
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
async function logoutUserController(req, res){
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController 
 * @description get the current loggedin user details
 * @access private
 */
async function getMeController(req, res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}