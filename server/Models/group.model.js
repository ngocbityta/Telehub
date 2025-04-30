const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    filename: String,
    cid: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    refreshToken: String,
})

module.exports = mongoose.model('Group', groupSchema)