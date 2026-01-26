const jwt = require('jsonwebtoken')

const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in millisecond
        httpOnly: true,
        sameSite: "none",
        secure: true
    })
}

module.exports = generateToken
