const { v4: uuidv4 } = require('uuid');
const streamServer = require('../stream');
const { FirebaseStorage } = require('../firebase');
const bucket = FirebaseStorage.bucket();
var User = require('../models/user.model');
var Group = require('../models/group.model');

const uploadToFirebaseStorage = async (file) => {
    var uuid = uuidv4();
    var imageURL = null;
    const remoteFile = bucket.file(uuid);
    await remoteFile.save(file.buffer, {
        contentType: file.mimetype,
        public: true,
    }).then(async () => {
        const downloadURL = await remoteFile.getSignedUrl({
            action: 'read',
            expires: '01-01-3000'
        });
        imageURL = downloadURL[0];
        console.log("File uploaded to Firebase");
    }).catch((err) => {
        console.log("Error uploading to Firebase: " + err);
    })
    return imageURL;
}

const deleteFromFirebaseStorage = async (filename) => {
    try {
        const fileRef = bucket.file(filename);
        await fileRef.delete();
        console.log(`File ${filename} deleted successfully from Firebase`);
    } catch (error) {
        console.error('Error deleting file from Firebase:', error);
    }
}

const handleFindUser = async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword)
        return res.sendStatus(400);
    const user = await User.findOne({ username: keyword });
    return res.status(200).json(user);
}

const handleCreateGroup = async (req, res) => {
    console.log("creating group");

    let imageURL;
    const image = req.file;
    if (!image) {
        imageURL = `https://picsum.photos/200`; // random fallback img
    }
    else {
        // upload to firebase
        imageURL = await uploadToFirebaseStorage(image);
    }
    const members = JSON.parse(req.body?.members);
    const users = await User.find({ _id: { $in: members } });
    const usernames = users.map(user => user.username);
    if (!usernames.includes(req.username))
        usernames.push(req.username);

    // save to database then create a stream channel
    const newGroup = new Group({ groupName: req.body.groupName, image: imageURL, owner: req.userId, members: members });
    newGroup.save().then(async () => {
        const channelId = newGroup._id.toString()
        const channel = streamServer.channel('messaging', channelId, {
            created_by_id: req.username,
        });
        await channel.create();
        await channel.update({
            image: imageURL,
            name: req.body.groupName,
            isGroup: true
        });
        await channel.addMembers([...usernames]); // username as userId
        newGroup.cid = channel.cid;
        await newGroup.save();
        return res.status(200).json({ ...newGroup._doc, members: users }); // replace members field with populated one
    }).catch((err) => {
        console.log(err);
        return res.sendStatus(500);
    })
}

const handleEditGroup = async (req, res) => {
    console.log("editing group");

    let imageURL = null;
    const image = req.file;

    const group = await Group.findById(req.params.id);

    if (image) {
        // delete old image in firebase
        if (group.filename)
            await deleteFromFirebaseStorage(group.filename);

        // upload to firebase
        imageURL = await uploadToFirebaseStorage(image);
    }
    const members = JSON.parse(req.body?.members);
    const users = await User.find({ _id: { $in: members } });
    const usernames = users.map(user => user.username);
    if (!usernames.includes(req.username))
        usernames.push(req.username);

    // save to database then update stream channel
    const oldName = group.groupName;
    group.groupName = req.body.groupName;
    if (imageURL)
        group.image = imageURL;
    group.members = members
    group.save().then(async () => {
        const cid = group.cid;
        const filter = { cid: { $eq: cid } };
        const channel = (await streamServer.queryChannels(filter))[0];
        const oldMembers = Object.keys(channel.state.members);
        const removeMembers = oldMembers.filter(member => !usernames.includes(member));
        const newMembers = usernames.filter(member => !oldMembers.includes(member));
        if (oldName !== req.body.groupName)
            await channel.update({
                image: group.image,   // keep all field because this is overwrite update
                name: req.body.groupName,
                isGroup: true
            }, {
                text: `${req.username} changed group title to ${req.body.groupName}`,
                user_id: `${req.username}`
            });
        if (imageURL)
            await channel.update({
                image: group.image,
                name: req.body.groupName,
                isGroup: true
            }, {
                text: `${req.username} changed group image`,
                user_id: `${req.username}`
            });
        if (removeMembers.length) {
            const removedNames = removeMembers.join(', ');
            await channel.removeMembers(removeMembers);
            const text = `${req.username} removed ${removedNames} from the group`;
            const message = {
                text,
                user_id: req.username,
                type: 'system'
            };
            await channel.sendMessage(message);
        }
        if (newMembers.length) {
            const newNames = newMembers.join(', ');
            await channel.addMembers(newMembers);
            const text = `${req.username} added ${newNames} to the group`;
            const message = {
                text,
                user_id: req.username,
                type: 'system'
            };
            await channel.sendMessage(message);
        }
        return res.status(200).json({ ...group._doc, members: users }); // replace members field with populated one
    }).catch((err) => {
        console.log(err);
        return res.sendStatus(500);
    })
}

const handleGetGroups = async (req, res) => {
    console.log("getting owned group");

    try {
        const groups = await Group.find({ owner: req.userId }).populate('members');
        return res.status(200).json(groups);
    } catch (error) {
        return res.sendStatus(500);
    }
}

const handleLeaveGroup = async (req, res) => {
    const cid = req.params.cid;
    console.log(`participant leaving ${cid}`);
    try {
        const filter = { cid: { $eq: cid } };
        const channel = (await streamServer.queryChannels(filter))[0];
        const text = `${req.username} has left the group`;
        const message = {
            text,
            user_id: req.username,
            type: 'system'
        };
        await channel.sendMessage(message);
        await channel.removeMembers([req.username]);
        const group = await Group.findOne({ cid: cid });
        const members = group.members;
        newMembers = members.filter(id => id.toString() !== req.userId);
        group.members = newMembers;
        await group.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const handleDeleteGroup = async (req, res) => {
    const cid = req.params.cid;
    console.log(`owner deleting ${cid}`);
    const deletedGroup = await Group.findOneAndDelete({ cid: cid });
    if (deletedGroup) {
        try {
            await streamServer.deleteChannels([cid], { hard_delete: true });
            return res.sendStatus(200);
        } catch (e) {
            if (e.code !== 16) {
                return res.sendStatus(500);
            }
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(500);
}

module.exports = { handleEditGroup, handleCreateGroup, handleFindUser, handleGetGroups, handleLeaveGroup, handleDeleteGroup }