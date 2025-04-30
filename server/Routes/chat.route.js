const router = require('express').Router();
const chatController = require('../controllers/chat.controller');

router.put('/delete/:cid', chatController.handleDeleteConversation)

module.exports = router;