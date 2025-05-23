import { createOrFindCall } from "../services/call.service.js";

const handleCreateCall = async (req, res) => {
  const cid = req.query.cid;
  const username = req.username;

  console.log(`${username} calling in ${cid}`);

  try {
    const call = await createOrFindCall(cid);
    return res.status(200).json({ cid: call._id.toString() });
  } catch (error) {
    console.error("Error creating/finding call:", error);
    return res.sendStatus(500);
  }
};

export default { handleCreateCall };
