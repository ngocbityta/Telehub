import aiService from "../services/ai.service.js";

const getGeminiResponseFromMessages = async (req, res) => {
  const userName = req.body.userName;
  const messages = req.body.messages;

  try {
    const result = await aiService.getGeminiResponseFromMessages(
      userName,
      messages
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error getting media from conversation:", error);
    return res.sendStatus(500);
  }
};

export default {
  getGeminiResponseFromMessages,
};
