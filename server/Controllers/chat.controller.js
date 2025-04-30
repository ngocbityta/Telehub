const streamServer = require('../stream');
var User = require('../models/user.model');

const handleDeleteConversation = async (req, res) => {
    console.log("hard-deleting conversation");

    const cid = req.params.cid;
    const filter = { cid: { $eq: cid } };
    const channel = (await streamServer.queryChannels(filter))[0];

    try {
        await channel.truncate({
            hard_delete: true,
            skip_push: false,
            message: {
                text: `${req.username} deleted the conversation.`,
                user_id: req.username
            }
        });
        return res.sendStatus(200);
    } catch (error) {
        console.log('Error soft-deleting channel:', error)
        return res.sendStatus(500);
    }
}


module.exports = { handleDeleteConversation }