const messageService = require("../Services/message.service");

const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, receiverId, text, image } = req.body;
    const message = await messageService.createMessage({
      chatId,
      senderId,
      receiverId,
      text,
      image,
    });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await messageService.getMessagesByChatId(chatId);
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

module.exports = {
  createMessage,
  getMessage,
};
