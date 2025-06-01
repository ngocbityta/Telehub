import authService from "../services/auth.service.js";

const handleLogin = async (req, res) => {
  const { identifier, password } = req.body;
  const result = await authService.loginUser(identifier, password);

  if (result.error) return res.status(400).json(result.error);

  res.cookie("jwt", result.refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
    maxAge: 86400000,
  });

  const { user, accessToken, streamToken } = result;

  res.status(200).json({
    accessToken,
    fullname: user.fullname,
    userId: user._id,
    email: user.email,
    username: user.username,
    image:
      user.image || `https://getstream.io/random_png/?name=${user.username}`,
    streamToken,
  });
};

const handleRegister = async (req, res) => {
  const { username, email, password } = req.body;
  const result = await authService.registerUser(username, email, password);

  if (result?.taken === 0) return res.status(409).json({ taken: 0 });
  if (result?.taken === 1) return res.status(409).json({ taken: 1 });

  res.cookie("jwt", result.refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
    maxAge: 86400000,
  });

  res.status(200).json({
    accessToken: result.accessToken,
    userId: result.user._id,
    email: result.user.email,
    username: result.user.username,
    image: result.user.image,
    streamToken: result.streamToken,
  });
};

const handleLogout = async (req, res) => {
  const token = req.cookies?.jwt;
  if (token) await authService.logoutUser(token);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "Strict", secure: true });
  res.sendStatus(204);
};

const handleRefreshToken = async (req, res) => {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).send("No JWT cookies");

  const result = await authService.refreshAccessToken(token);
  if (result.error) return res.status(403).send(result.error);

  const { user, accessToken, streamToken } = result;

  res.status(200).json({
    username: user.username,
    userId: user._id,
    fullname: user.fullname,
    email: user.email,
    accessToken,
    streamToken,
    image:
      user.image || `https://getstream.io/random_png/?name=${user.username}`,
  });
};

const handleForget = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(409).json("Invalid email address");

  const result = await authService.forgetPassword(email);
  if (result?.error) return res.status(409).json(result.error);

  res.sendStatus(200);
};

const handleRecover = async (req, res) => {
  const { username, password } = req.body;
  const success = await authService.recoverPassword(username, password);
  if (success) return res.sendStatus(200);
  return res.sendStatus(500);
};

const handleVerifyToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(500).json("Internal server error");

  const user = await authService.verifyToken(token);
  if (!user) return res.status(403).json("Token Expired");

  res.status(200).json({
    username: user.username,
    email: user.email,
    image: user.image,
  });
};

const handleGoogleLogin = async (req, res) => {
  const { email, name, picture } = req.body;
  const result = await authService.googleLogin({ email, name, picture });

  if (!result) return res.status(500).json("Error login with Google");

  res.cookie("jwt", result.refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
    maxAge: 86400000,
  });

  const { user, accessToken, streamToken } = result;

  res.status(200).json({
    accessToken,
    fullname: user.fullname,
    userId: user._id,
    email: user.email,
    username: user.username,
    image:
      user.image || `https://getstream.io/random_png/?name=${user.username}`,
    streamToken,
  });
};

export default {
  handleLogin,
  handleRegister,
  handleLogout,
  handleRefreshToken,
  handleForget,
  handleRecover,
  handleVerifyToken,
  handleGoogleLogin,
};
