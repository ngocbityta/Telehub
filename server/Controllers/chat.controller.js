import { hardDeleteConversation } from "../services/chat.service.js";

const handleDeleteConversation = async (req, res) => {
  console.log("hard-deleting conversation");

  const cid = req.params.cid;
  const username = req.username;

  try {
    await hardDeleteConversation(cid, username);
    return res.sendStatus(200);
  } catch (error) {
    console.error("Error hard-deleting channel:", error);
    return res.sendStatus(500);
  }
};

export default { handleDeleteConversation };
