import { Schema, model } from 'mongoose'

const userSchema = new Schema({
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

export default model('User', userSchema)