const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const { StreamChat } = require('stream-chat');
const streamServer = StreamChat.getInstance(api_key, api_secret);

module.exports = streamServer;