const mongoose = require('mongoose')

const callSchema = new mongoose.Schema({
    cid: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Call', callSchema)