import friendService from "../services/friend.service.js";

const editFriendList = async (req, res) => {
  try {
    const user = await friendService.editFriendList(
      req.body.userId,
      req.body.friendList
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

const createFriendRequest = async (req, res) => {
  try {
    await friendService.createFriendRequest(req.body.userId, req.body.friendId);
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const responseFriendRequest = async (req, res) => {
  try {
    await friendService.responseFriendRequest(req.body.friendRequestId, req.body.type);
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const getFriendRequestList = async (req, res) => {
  try {
    const result = await friendService.getFriendRequestList(req.body.userId);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const deleteFriend = async (req, res) => {
  try {
    await friendService.deleteFriend(req.body.userId, req.body.friendId);
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};


const searchFriends = async (req, res) => {
  try {
    const result = await friendService.searchFriends(req.body.userId, req.body.username);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export default { editFriendList, getFriendList, searchFriends, createFriendRequest, responseFriendRequest, getFriendRequestList, deleteFriend };
