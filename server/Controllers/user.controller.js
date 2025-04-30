const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { FirebaseStorage } = require('../firebase');
const bucket = FirebaseStorage.bucket();
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

const handleEditInfo = async (req, res) => {
    console.log(`${req.username} updating profile`);
    try {
        const user = await User.findById(req.userId);
        if (user) {
            let imageURL;
            const image = req.file;
            if (image) {

                if (user.filename)
                    await deleteFromFirebaseStorage(user.filename);

                imageURL = await uploadToFirebaseStorage(image);
                user.image = imageURL;
            }

            const { fullname, email } = req.body;

            if (fullname)
                user.fullname = fullname.trim();

            if (email) {
                const exist = await User.findOne({ email: email });
                if (exist && exist.username !== req.username)
                    return res.status(401).json('Email taken')

                user.email = email.trim();
            }

            user.save().then(() => {
                return res.status(200).json(user);
            }).catch(err => {
                console.log(err);
                return res.status(500).json('Internal Server Error');
            })
        }
        else {
            return res.status(500).json('Internal Server Error');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server Error');
    }
}

const handleChangePassword = async (req, res) => {
    console.log(`${req.username} changing password`);
    try {
        const user = await User.findById(req.userId);
        if (user) {
            const { oldPassword, newPassword, matchPassword } = req.body;
            if (newPassword !== matchPassword) {
                // console.log(newPassword, matchPassword);
                return res.status(401).json('Confirm password does not match')
            }

            const correctPassword = await bcrypt.compare(oldPassword, user.password);
            if (correctPassword) {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        return res.status(500).json('Internal Server Error');
                    }

                    // Hash the password using the generated salt
                    bcrypt.hash(newPassword, salt, async (err, hashedPassword) => {
                        if (err) {
                            return res.status(500).json("Error hashing password: " + err);
                        }
                        user.password = hashedPassword;
                        await user.save();
                        return res.status(200).json('Password saved');
                    });
                });
            }
            else
                return res.status(401).json('Current password does not correct')
        }
        else {
            return res.status(500).json('Internal Server Error');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server Error');
    }
}

module.exports = { handleEditInfo, handleChangePassword }