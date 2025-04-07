const messageModel = require("../Models/message.model");

const createMessage = async ({ chatId, senderId, receiverId, text, image }) => {
  const message = new messageModel({
    chatId,
    senderId,
    receiverId,
    text,
    image,
  });
  return await message.save();
};

const getMessagesByChatId = async (chatId) => {
  return await messageModel.find({ chatId });
};

module.exports = {
  createMessage,
  getMessagesByChatId,
};
