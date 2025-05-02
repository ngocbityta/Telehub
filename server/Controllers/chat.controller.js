const chatService = require('../services/chat.service');

const handleDeleteConversation = async (req, res) => {
    console.log('hard-deleting conversation');

    const cid = req.params.cid;
    const username = req.username;

    try {
        await chatService.hardDeleteConversation(cid, username);
        return res.sendStatus(200);
    } catch (error) {
        console.error('Error hard-deleting channel:', error);
        return res.sendStatus(500);
    }
};

module.exports = { handleDeleteConversation };
