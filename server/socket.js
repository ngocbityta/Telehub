import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const getRecieverSocketId = (username) => {
  return userSocketMap[username];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  const username = socket.handshake.query.username;

  if (username) {
    console.log(`Created socket connection for ${username}: ${socket.id}`);
    userSocketMap[username] = userSocketMap[username] || [];
    userSocketMap[username].push(socket.id);

    socket.on("calling", (data) => {
      console.log(data);

      const memberIds = JSON.parse(data.memberIds);
      const calledMembers = {};

      memberIds.forEach((memberId) => {
        if (userSocketMap[memberId] && userSocketMap[memberId].length > 0) {
          const memberSocketId = userSocketMap[memberId][0];
          if (memberSocketId !== socket.id && !calledMembers[memberSocketId]) {
            io.to(memberSocketId).emit("someone_calling", {
              caller: username,
              callType: data.callType,
              isGroup: data.isGroup,
              name: data.name,
              image: data.image,
              callId: data.callId,
            });
            console.log(`Ringing call to ${memberSocketId}`);
            calledMembers[memberSocketId] = true;
          }
        }
      });
    });

    socket.on("disconnect", () => {
      console.log(`${username} disconnected: ${socket.id}`);
      if (userSocketMap[username]) {
        const index = userSocketMap[username].indexOf(socket.id);
        if (index !== -1) {
          userSocketMap[username].splice(index, 1);
          if (userSocketMap[username].length === 0) {
            delete userSocketMap[username];
          }
        }
      }
    });
  }
});

export { app, io, server, getRecieverSocketId };
