import Call from "../models/call.model.js";

const createOrFindCall = async (cid) => {
  const existingCall = await Call.findOne({ cid });
  if (existingCall) {
    return existingCall;
  }

  const newCall = new Call({ cid });
  await newCall.save();
  return newCall;
};

export { createOrFindCall };
