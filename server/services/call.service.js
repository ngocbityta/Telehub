const Call = require('../models/call.model');

const createOrFindCall = async (cid) => {
    const existingCall = await Call.findOne({ cid });
    if (existingCall) {
        return existingCall;
    }

    const newCall = new Call({ cid });
    await newCall.save();
    return newCall;
};

module.exports = { createOrFindCall };
