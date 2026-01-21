const generateToken = require('../config/utils')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

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
        res.status(500).json({message: "Internal Server Error"})
    }
}


const login = (req, res) => {
    
}
const logout = (req, res) => {
    res.send("logout route")
}

module.exports = {signup, login, logout}