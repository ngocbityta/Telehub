import friendService from "../services/friend.service.js";

const editFriendList = async (req, res) => {
  try {
    const user = await friendService.editFriendList(
      req.body.userId,
      req.body.userFriends
    );
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const getFriendList = async (req, res) => {
  try {
    const result = await friendService.getFriendList(req.body.userId);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export default { editFriendList, getFriendList };
