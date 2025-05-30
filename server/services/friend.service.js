import Friend from "../models/friend.model.js";
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
  const body = {
    userId,
    username: user.username,
    userAvatar: user.image,
    friendId,
    friendName: friend.username,
    friendAvatar: friend.image,
  };
  const existedFriendRequest = await FriendRequest.findOne(body);
  if (!existedFriendRequest) {
    const newFriendRequest = await FriendRequest.create(body);
    newFriendRequest.save();
  }
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

const getFriendResponseList = async (userId) => {
  const friendResponseList = await FriendRequest.find({ friendId: userId });
  return friendResponseList;
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

  const friendRequestList = await getFriendRequestList(userId);
  const friendResponseList = await getFriendResponseList(userId);

  let filter;
  if (username) filter.username = { $regex: username, $options: "i" };
  const users = await User.find({
    filter,
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

    const isResponse = friendResponseList.some(
      (req) => req.userId === user._id.toString()
    );

    if (isFriend) relationship = "friend";
    else if (isRequested) relationship = "friend request";
    else if (isResponse) relationship = "friend response";

    return {
      id: user._id,
      username: user.username,
      avatar: user.image,
      relationship,
    };
  });
};

const updateLocationWithFriends = async (
  userId,
  friendIds,
  longitude,
  latitude
) => {
  for (const friendId of friendIds) {
    await Friend.findOneAndUpdate(
      {
        userId: friendId,
        "friendList.id": userId,
      },
      {
        $set: {
          "friendList.$.longitude": longitude,
          "friendList.$.latitude": latitude,
        },
      }
    );
  }
};

export default {
  editFriendList,
  getFriendList,
  createFriendRequest,
  responseFriendRequest,
  getFriendRequestList,
  deleteFriend,
  searchFriends,
  updateLocationWithFriends,
};
