const express = require('express')
const { signup, login, logout, updateProfile, checkAuth } = require('../controllers/authControllers')
const authUpdate = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.put('/update-profile', authUpdate ,updateProfile)
router.get('/check', authUpdate, checkAuth)

module.exports = router