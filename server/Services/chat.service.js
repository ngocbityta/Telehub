const chatModel = require("../Models/chat.model");

const findChatByMembers = async (firstId, secondId) => {
  return await chatModel.findOne({
    members: { $all: [firstId, secondId] },
  });
};

const createNewChat = async (firstId, secondId) => {
  const newChat = new chatModel({
    members: [firstId, secondId],
  });
  return await newChat.save();
};

const findChatsByUser = async (userId) => {
  return await chatModel.find({
    members: { $in: [userId] },
  });
};

const findChatExact = async (firstId, secondId) => {
  return await chatModel.find({
    members: { $all: [firstId, secondId] },
  });
};

module.exports = {
  findChatByMembers,
  createNewChat,
  findChatsByUser,
  findChatExact,
};