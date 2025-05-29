import Friend from "../models/friend.model.js";
import _ from "lodash";
import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";

const editFriendList = async (userId, friendList) => {
  let friendDoc = await Friend.findOne({ userId });

  if (friendDoc) {
    friendDoc.friendList = friendList;
    await friendDoc.save();
    return friendDoc;
  }
  const existedUser = await User.findById(userId);
  if (!existedUser) {
    throw new Error("User not found");
  }

  const newFriendList = new Friend({
    userId,
    friendList,
  });

  await newFriendList.save();
  return newFriendList;
};

const getFriendList = async (userId) => {
  let friendDoc = await Friend.findOne({ userId });
  if (!friendDoc) {
    friendDoc = await Friend.create({
      userId,
      friendList: [],
    });
  }
  return friendDoc.friendList;
};

const createFriendRequest = async (userId, friendId) => {
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  const newFriendRequest = await FriendRequest.create({
    userId,
    username: user.username,
    userAvatar: user.image,
    friendId,
    friendName: friend.username,
    friendAvatar: friend.image,
  });
  newFriendRequest.save();
};

const responseFriendRequest = async (friendRequestId, type) => {
  const friendRequest = await FriendRequest.findById(friendRequestId);

  if (type === "accept") {
    let friendList = await getFriendList(friendRequest.userId);
    friendList.push({
      id: friendRequest.friendId,
      username: friendRequest.friendName,
      avatar: friendRequest.friendAvatar,
    });
    await editFriendList(friendRequest.userId, friendList);

    friendList = await getFriendList(friendRequest.friendId);
    friendList.push({
      id: friendRequest.userId,
      username: friendRequest.username,
      avatar: friendRequest.userAvatar,
    });
    await editFriendList(friendRequest.friendId, friendList);
  }

  await FriendRequest.deleteOne({ _id: friendRequestId });
};

const getFriendRequestList = async (userId) => {
  const friendRequestList = await FriendRequest.find({ userId });
  return friendRequestList;
};

const deleteFriend = async (userId, friendId) => {
  const userDoc = await Friend.findOne({ userId });
  if (userDoc) {
    userDoc.friendList = userDoc.friendList.filter(
      (friend) => friend.id !== friendId
    );
    await userDoc.save();
  }

  const friendDoc = await Friend.findOne({ userId: friendId });
  if (friendDoc) {
    friendDoc.friendList = friendDoc.friendList.filter(
      (friend) => friend.id !== userId
    );
    await friendDoc.save();
  }
};
const searchFriends = async (userId, username) => {
  const friendDoc = await Friend.findOne({ userId });
  const friendList = friendDoc?.friendList || [];

  const friendRequestList = await getFriendRequestList(userId); // list các yêu cầu kết bạn do userId gửi

  const users = await User.find({
    username: { $regex: username, $options: "i" },
    _id: { $ne: userId },
  });

  return users.map((user) => {
    let relationship = "stranger";

    const isFriend = friendList.some(
      (friend) => friend.id.toString() === user._id.toString()
    );
    const isRequested = friendRequestList.some(
      (req) => req.friendId.toString() === user._id.toString()
    );

    if (isFriend) relationship = "friend";
    else if (isRequested) relationship = "friend request";

    return {
      id: user._id,
      username: user.username,
      avatar: user.image,
      relationship,
    };
  });
};

export default {
  editFriendList,
  getFriendList,
  createFriendRequest,
  responseFriendRequest,
  getFriendRequestList,
  deleteFriend,
  searchFriends,
};
