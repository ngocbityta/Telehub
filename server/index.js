const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const { Server } = require("socket.io");
const app = express();
const { blackbox } = require("@shuddho11288/blackboxai-api");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

function removeFirstLine(inputString) {
  const lines = inputString.split("\n");
  if (lines.length > 0) {
    lines.shift();
  }
  return lines.join("\n");
}

//Chatbot
const getBotResponse = async (message) => {
  let answer = "";
  try {
    const answera = await blackbox(message).then((data) => {
      answer = data;
    });
  } catch (error) {
    console.error("Error fetching response:", error);
  }
  return answer;
};

// CRUD

app.get("/", (req, res) => {
  res.send("Welcome our chat app APIs ..");
});

const port = process.env.PORT;
const uri = process.env.ATLAS_URI;

const expressServer = app.listen(port, (req, res) => {
  console.log(`Server running on port : ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const io = new Server(expressServer, { cors: process.env.CLIENT_URL });
var onlineUsers = [];

io.on("connection", (socket) => {
  // listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user?.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    io.emit("getOnlineUsers", onlineUsers);
  });
  // add message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (user) {
      console.log("getOnlineUsers", user);
      io.to(user.socketId).emit("newMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });
  //chatbot
  socket.on("chatbot-message", async (msg) => {
    // console.log('Message received: ' + msg);
    const botResponse = await getBotResponse(msg);
    socket.emit("chatbot-message", removeFirstLine(botResponse)); // Send response back to the client
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId != socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});
