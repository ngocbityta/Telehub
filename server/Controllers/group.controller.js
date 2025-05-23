import { v4 as uuidv4 } from "uuid";
import streamServer from "../stream.js";
import { FirebaseStorage } from "../firebase.js";
import User from "../models/user.model.js";
import Group from "../models/group.model.js";

const bucket = FirebaseStorage.bucket();

const uploadToFirebaseStorage = async (file) => {
  const uuid = uuidv4();
  let imageURL = null;
  const remoteFile = bucket.file(uuid);
  try {
    await remoteFile.save(file.buffer, {
      contentType: file.mimetype,
      public: true,
    });
    const downloadURL = await remoteFile.getSignedUrl({
      action: "read",
      expires: "01-01-3000",
    });
    imageURL = downloadURL[0];
    console.log("File uploaded to Firebase");
  } catch (err) {
    console.log(`Error uploading to Firebase: ${err}`);
  }
  return imageURL;
};

const deleteFromFirebaseStorage = async (filename) => {
  try {
    const fileRef = bucket.file(filename);
    await fileRef.delete();
    console.log(`File ${filename} deleted successfully from Firebase`);
  } catch (error) {
    console.error("Error deleting file from Firebase:", error);
  }
};

const handleFindUser = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.sendStatus(400);
  const user = await User.findOne({ username: keyword });
  return res.status(200).json(user);
};

const handleCreateGroup = async (req, res) => {
  let imageURL;

  const image = req.file;
  if (!image) {
    imageURL = "https://picsum.photos/200"; // fallback
  } else {
    imageURL = await uploadToFirebaseStorage(image);
  }

  const members = JSON.parse(req.body?.members);
  const users = await User.find({ _id: { $in: members } });
  const usernames = users.map((user) => user.username);

  if (!usernames.includes(req.username)) {
    usernames.push(req.username);
  }

  const newGroup = new Group({
    groupName: req.body.groupName,
    image: imageURL,
    owner: req.userId,
    members,
  });

  try {
    await newGroup.save();
    const channelId = newGroup._id.toString();
    const channel = streamServer.channel("messaging", channelId, {
      created_by_id: req.username,
    });

    await channel.create();
    await channel.update({
      image: imageURL,
      name: req.body.groupName,
      isGroup: true,
    });
    await channel.addMembers([...usernames]);

    newGroup.cid = channel.cid;
    await newGroup.save();

    return res.status(200).json({ ...newGroup._doc, members: users });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

const handleEditGroup = async (req, res) => {
  let imageURL = null;
  const image = req.file;

  const group = await Group.findById(req.params.id);

  if (image) {
    if (group.filename) {
      await deleteFromFirebaseStorage(group.filename);
    }
    imageURL = await uploadToFirebaseStorage(image);
  }

  const members = JSON.parse(req.body?.members);
  const users = await User.find({ _id: { $in: members } });
  const usernames = users.map((user) => user.username);

  if (!usernames.includes(req.username)) {
    usernames.push(req.username);
  }

  const oldName = group.groupName;
  group.groupName = req.body.groupName;
  if (imageURL) group.image = imageURL;
  group.members = members;

  try {
    await group.save();

    const { cid } = group;
    const filter = { cid: { $eq: cid } };
    const channel = (await streamServer.queryChannels(filter))[0];
    const oldMembers = Object.keys(channel.state.members);

    const removeMembers = oldMembers.filter((m) => !usernames.includes(m));
    const newMembers = usernames.filter((m) => !oldMembers.includes(m));

    if (oldName !== req.body.groupName) {
      await channel.update(
        {
          image: group.image,
          name: req.body.groupName,
          isGroup: true,
        },
        {
          text: `${req.username} changed group title to ${req.body.groupName}`,
          user_id: req.username,
        }
      );
    }

    if (imageURL) {
      await channel.update(
        {
          image: group.image,
          name: req.body.groupName,
          isGroup: true,
        },
        {
          text: `${req.username} changed group image`,
          user_id: req.username,
        }
      );
    }

    if (removeMembers.length) {
      await channel.removeMembers(removeMembers);
      await channel.sendMessage({
        text: `${req.username} removed ${removeMembers.join(
          ", "
        )} from the group`,
        user_id: req.username,
        type: "system",
      });
    }

    if (newMembers.length) {
      await channel.addMembers(newMembers);
      await channel.sendMessage({
        text: `${req.username} added ${newMembers.join(", ")} to the group`,
        user_id: req.username,
        type: "system",
      });
    }

    return res.status(200).json({ ...group._doc, members: users });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

const handleGetGroups = async (req, res) => {
  console.log("getting owned group");
  try {
    const groups = await Group.find({ owner: req.userId }).populate("members");
    return res.status(200).json(groups);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res.sendStatus(500);
  }
};

const handleLeaveGroup = async (req, res) => {
  const { cid } = req.params;
  console.log(`participant leaving ${cid}`);
  try {
    const filter = { cid: { $eq: cid } };
    const channel = (await streamServer.queryChannels(filter))[0];

    await channel.sendMessage({
      text: `${req.username} has left the group`,
      user_id: req.username,
      type: "system",
    });

    await channel.removeMembers([req.username]);

    const group = await Group.findOne({ cid });
    group.members = group.members.filter((id) => id.toString() !== req.userId);
    await group.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const handleDeleteGroup = async (req, res) => {
  const { cid } = req.params;
  console.log(`owner deleting ${cid}`);
  try {
    const deletedGroup = await Group.findOneAndDelete({ cid });
    if (deletedGroup) {
      try {
        await streamServer.deleteChannels([cid], { hard_delete: true });
        return res.sendStatus(200);
      } catch (e) {
        if (e.code !== 16) return res.sendStatus(500);
        return res.sendStatus(200);
      }
    }
    return res.sendStatus(500);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export default {
  handleEditGroup,
  handleCreateGroup,
  handleFindUser,
  handleGetGroups,
  handleLeaveGroup,
  handleDeleteGroup,
};
