const jwt = require("jsonwebtoken");
const User = require('../models/userModel')

const authUpdate = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({success: false, message: "Unauthorized not token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({success: false, message: "Token invalid"})
        }

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"})
        }

        req.user = user

        next()
    } catch (err) {
        console.error("Error", err)
        res.status(500).json({success: false, message: err.message})
    }
}

module.exports = authUpdate