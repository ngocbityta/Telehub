import { Schema, model } from "mongoose";

const groupSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  filename: String,
  cid: String,
  owner: {
    type: Schema.Types.ObjectId,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  refreshToken: String,
});

export default model("Group", groupSchema);
