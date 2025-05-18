import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model.js";
import gmailService from "./gmail.service.js";
import streamServer from "../stream.js";

function normalizeVietnamese(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s/g, "");
}

const loginUser = async (identifier, password) => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const query = EMAIL_REGEX.test(identifier)
    ? { email: identifier }
    : { username: identifier };
  const user = await User.findOne(query);
  if (!user) return { error: "User not found" };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { error: "Wrong Password" };

  const accessToken = JWT.sign(
    { UserInfo: userInfo(user) },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "8h" }
  );
  const refreshToken = JWT.sign(
    { UserInfo: userInfo(user) },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  const streamToken = await streamServer.createToken(user.username);

  return { user, accessToken, refreshToken, streamToken };
};

const registerUser = async (username, email, password) => {
  if (await User.findOne({ username })) return { taken: 0 };
  if (await User.findOne({ email })) return { taken: 1 };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const refreshToken = JWT.sign(
    { UserInfo: { username, email } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    refreshToken,
    image: `https://getstream.io/random_svg/?id=oliver&name=${username}`,
  });

  await newUser.save();

  const accessToken = JWT.sign(
    { UserInfo: userInfo(newUser) },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "8h" }
  );
  const streamToken = await streamServer.createToken(username);

  return { user: newUser, accessToken, refreshToken, streamToken };
};

const logoutUser = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });
  if (!user) return;

  user.refreshToken = null;
  await user.save();
};

const refreshAccessToken = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });
  if (!user) return { error: "Invalid refresh token" };

  try {
    const decoded = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (decoded.UserInfo.username !== user.username) throw new Error();

    const accessToken = JWT.sign(
      { UserInfo: userInfo(user) },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "8h" }
    );
    const streamToken = await streamServer.createToken(user.username);

    return { user, accessToken, streamToken };
  } catch {
    return { error: "Token expired or invalid" };
  }
};

const forgetPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return { error: "Email not registered" };

  const token = JWT.sign(
    { email, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  const url = `https://telehub.id.vn/recover?token=${token}`;

  await gmailService.sendRecoverEmail(email, user.username, url);
};

const recoverPassword = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) return false;

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  user.password = hashed;
  await user.save();
  return true;
};

const verifyToken = async (token) => {
  try {
    const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ email: decoded.email });
    return user;
  } catch {
    return null;
  }
};

const googleLogin = async ({ email, name, picture }) => {
  let user = await User.findOne({ email });

  if (!user) {
    const username = normalizeVietnamese(name) + uuidv4().substring(0, 5);
    const password = uuidv4().substring(0, 6);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      fullname: name,
      password: hashedPassword,
      image: picture,
    });
  }

  const accessToken = JWT.sign(
    { UserInfo: userInfo(user) },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "8h" }
  );
  const refreshToken = JWT.sign(
    { UserInfo: userInfo(user) },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  const streamToken = await streamServer.createToken(user.username);

  return { user, accessToken, refreshToken, streamToken };
};

const userInfo = (user) => ({
  username: user.username,
  userId: user._id,
  email: user.email,
  fullname: user.fullname,
});

export default {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  forgetPassword,
  recoverPassword,
  verifyToken,
  googleLogin,
};
