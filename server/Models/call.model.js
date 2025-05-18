import { Schema, model } from "mongoose";

const callSchema = new Schema({
  cid: {
    type: String,
    required: true,
  },
});

export default model("Call", callSchema);
