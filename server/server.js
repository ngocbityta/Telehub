import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import { app, server } from "./socket.js";

app.use(
  cors({
    origin: "https://telehub.id.vn",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { dbName: "telehub" });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Cloud connection established successfully");
});

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import groupRoute from "./routes/group.route.js";
import callRoute from "./routes/call.route.js";
import chatRoute from "./routes/chat.route.js";
import verifyJWT from "./middlewares/verifyJWT.js";
app.use("/api/auth", authRoute);
app.use("/api/user", verifyJWT, userRoute);
app.use("/api/group", verifyJWT, groupRoute);
app.use("/api/call", verifyJWT, callRoute);
app.use("/api/chat", verifyJWT, chatRoute);

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.join(__dirname, "./client/build");

app.use(express.static(buildPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// server host
const port = process.env.PORT || 3000;
const ip = process.env.IP || "0.0.0.0";

server.listen(port, ip, () => {
  console.log(`Server is running at ${ip}:${port}`);
});
