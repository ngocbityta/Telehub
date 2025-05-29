import { Schema, model } from "mongoose";

const friendSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
      unique: true,
    },
    friendList: [
      {
        id: {
          type: String,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
          required: false,
        },
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Friend", friendSchema);
