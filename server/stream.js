import dotenv from "dotenv";

dotenv.config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
import { StreamChat } from "stream-chat";
const streamServer = StreamChat.getInstance(api_key, api_secret);

export default streamServer;
