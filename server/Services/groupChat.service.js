const GroupChat = require("../Models/groupChat.model");

const createGroupChat = async (data) => {
  const group = new GroupChat(data);
  return await group.save();
};

const getAllGroupChats = async (userId) => {
  if (userId) {
    return await GroupChat.find({ members: userId }).populate("lastMessage");
  }
  return await GroupChat.find().populate("lastMessage");
};

const getGroupChatById = async (id) => {
  return await GroupChat.findById(id).populate(
    "members admins messages lastMessage"
  );
};

const updateGroupChat = async (id, data) => {
  return await GroupChat.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteGroupChat = async (id) => {
  return await GroupChat.findByIdAndDelete(id);
};

module.exports = {
  createGroupChat,
  getAllGroupChats,
  getGroupChatById,
  updateGroupChat,
  deleteGroupChat,
};
