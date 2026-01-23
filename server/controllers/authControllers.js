const generateToken = require('../config/utils')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const cloudinary = require("../config/cloudinary")

const signup = async (req, res) => {
    const  { fullName, email, password } = req.body

    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"})
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must bue 6 characters" })
        }

        const user = await User.findOne({email})

        if (user) return res.status(400).json({ success: false, message: "Email already exists" })
        
        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })
        
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({success: false, message: "Invalid user data"})
        }

    } catch (err) {
        console.error("Error in signup", err)
        res.status(500).json({message: err.message})
    }
}
const login = async (req, res) => {
    const {email, password} = req.body
    
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }        

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({status: false, message: "Invalid Credentials"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (err) {
        console.log('Error Login', err)
        res.status(500).json({success: false, message: err.message})
    }
}
const logout = (req, res) => {
    try {
        res.cookie("token", "", {maxAge:0})
        res.status(200).json({succcess: true, message: "Logged out successfully"})
    } catch (err) {

    }
}
const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({message: "Profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new: true})

        res.status(200).json(updatedUser)

    } catch (err) {
        console.error("Error ",err)
        res.status(500).json({success: false, message: err.message})
    }
}
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.log("Error ", err.message)
        res.status(500).json({success: false, message: err.message})
    }
}


module.exports = {signup, login, logout, updateProfile, checkAuth}