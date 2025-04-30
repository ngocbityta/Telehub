var Call = require('../models/call.model');

const handleCreateCall = async (req, res) => {
    const cid = req.query.cid;
    console.log(`${req.username} calling in ${cid}`);
    try {
        const call = await Call.findOne({ cid: cid });
        if (call) {
            return res.status(200).json({ cid: call._id });
        }
        else {
            const newCall = new Call({ cid: cid });
            await newCall.save();
            return res.status(200).json({ cid: newCall._id.toString() });
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

module.exports = { handleCreateCall }