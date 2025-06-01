import { Schema, model } from "mongoose";

const friendRequestSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
    },
    friendId: {
      type: String,
      required: true,
    },
    friendName: {
      type: String,
      required: true,
    },
    friendAvatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("FriendRequest", friendRequestSchema);
