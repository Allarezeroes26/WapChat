const express = require('express')
const authUpdate = require('../middleware/authMiddleware')
const router = express.Router()
const { getUserSidebar, getMessages, sendMessage } = require('../controllers/messageController')

router.get('/users', authUpdate, getUserSidebar)
router.get('/:id', authUpdate, getMessages)
router.post('/send/:id', authUpdate, sendMessage)

module.exports = router