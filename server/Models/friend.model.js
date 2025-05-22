import { Schema, model } from "mongoose";

const friendSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
      unique: true,
    },
    userFriends: [
      {
        id: {
          type: String,
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Friend", friendSchema);
