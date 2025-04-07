const groupChatService = require('../Services/groupChat.service');

const createGroupChat = async (req, res) => {
  try {
    const group = await groupChatService.createGroupChat(req.body);
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllGroupChats = async (req, res) => {
  try {
    const groups = await groupChatService.getAllGroupChats(req.query.userId);
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroupChatById = async (req, res) => {
  try {
    const group = await groupChatService.getGroupChatById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGroupChat = async (req, res) => {
  try {
    const group = await groupChatService.updateGroupChat(req.params.id, req.body);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteGroupChat = async (req, res) => {
  try {
    const result = await groupChatService.deleteGroupChat(req.params.id);
    if (!result) return res.status(404).json({ error: 'Group not found' });
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createGroupChat,
  getAllGroupChats,
  getGroupChatById,
  updateGroupChat,
  deleteGroupChat
};
