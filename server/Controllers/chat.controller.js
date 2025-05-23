import chatService from "../services/chat.service.js";

const handleDeleteConversation = async (req, res) => {
  const cid = req.params.cid;
  const username = req.username;

  try {
    await chatService.hardDeleteConversation(cid, username);
    return res.sendStatus(200);
  } catch (error) {
    console.error("Error hard-deleting channel:", error);
    return res.sendStatus(500);
  }
};

const getMediaFromConservation = async (req, res) => {
  const cid = req.params.cid;

  try {
    const media = await chatService.getMediaFromConservation(cid);
    return res.status(200).json(media);
  } catch (error) {
    console.error("Error getting media from conversation:", error);
    return res.sendStatus(500);
  }
};

const getFilesFromConversation = async (req, res) => {
  const cid = req.params.cid;

  try {
    const assets = await chatService.getFilesFromConversation(cid);
    return res.status(200).json(assets);
  } catch (error) {
    console.error("Error getting files from conversation:", error);
    return res.sendStatus(500);
  }
};

const searchMessageFromConversation = async (req, res) => {
  const cid = req.params.cid;
  const searchText = req.body.searchText;

  try {
    const messages = await chatService.searchMessageFromConversation(
      cid,
      searchText
    );
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages from conversation:", error);
    return res.sendStatus(500);
  }
};

export default {
  handleDeleteConversation,
  getMediaFromConservation,
  getFilesFromConversation,
  searchMessageFromConversation,
};
