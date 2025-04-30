const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: false
    },
    filename: String,
    image: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String,
})

module.exports = mongoose.model('User', userSchema)