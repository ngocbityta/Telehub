const bcrypt = require('bcrypt');
const { FirebaseStorage } = require('../firebase');
const bucket = FirebaseStorage.bucket();
const { v4: uuidv4 } = require('uuid');
var User = require('../models/user.model');

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

const editUserInfo = async (userId, username, file, body) => {
    const user = await User.findById(userId);
    if (user) {
        let imageURL;
        if (file) {
            if (user.filename)
                await deleteFromFirebaseStorage(user.filename);

            imageURL = await uploadToFirebaseStorage(file);
            user.image = imageURL;
        }

        const { fullname, email } = body;

        if (fullname)
            user.fullname = fullname.trim();

        if (email) {
            const exist = await User.findOne({ email: email });
            if (exist && exist.username !== username)
                throw new Error('Email taken');

            user.email = email.trim();
        }

        await user.save();
        return user;
    }
    throw new Error('User not found');
}

const changePassword = async (userId, oldPassword, newPassword, matchPassword) => {
    const user = await User.findById(userId);
    if (user) {
        if (newPassword !== matchPassword) {
            throw new Error('Confirm password does not match');
        }

        const correctPassword = await bcrypt.compare(oldPassword, user.password);
        if (correctPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            await user.save();
            return 'Password saved';
        }
        throw new Error('Current password is incorrect');
    }
    throw new Error('User not found');
}

module.exports = { editUserInfo, changePassword };
