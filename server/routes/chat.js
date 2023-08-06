const { Router } = require('express')
const chatController = require('../controllers/chat')

const router = Router()

router.post('/upload-chat-image', chatController.uploadChatImage)
router.post('/delete-chat-image', chatController.deleteChatImage)

module.exports = router
