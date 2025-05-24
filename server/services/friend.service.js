import Friend from "../models/friend.model.js";
import User from "../models/user.model.js";

const editFriendList = async (userId, userFriends) => {
  let friendDoc = await Friend.findOne({ userId });

  if (friendDoc) {
    friendDoc.userFriends = userFriends;
    await friendDoc.save();
    return friendDoc;
  }
  const existedUser = await User.findById(userId);
  if (!existedUser) {
    throw new Error("User not found");
  }

  const newFriendList = new Friend({
    userId,
    userFriends,
  });

  await newFriendList.save();
  return newFriendList;
};

const getFriendList = async (userId) => {
  const friendDoc = await Friend.findOne({ userId });

  if (friendDoc) {
    return friendDoc.userFriends;
  }

  throw new Error("User not found");
};

export default { editFriendList, getFriendList };
