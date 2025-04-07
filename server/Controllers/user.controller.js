const validator = require("validator");
const jwt = require("jsonwebtoken");
const userService = require("../Services/user.service");

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json("All fields are required.");

    if (!validator.isEmail(email))
      return res.status(400).json("Invalid email format.");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password is not strong enough.");

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser)
      return res.status(400).json("User with this email already exists.");

    const user = await userService.createUser({ name, email, password });
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user)
      return res.status(400).json("Invalid email or password.");

    const isValidPassword = await userService.comparePassword(
      password,
      user.password
    );

    if (!isValidPassword)
      return res.status(400).json("Invalid email or password.");

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const findUser = async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.userId);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getUser = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { name, email, password } = req.body;

  try {
    const user = await userService.findUserById(userId);
    let updatedData = { name, email };

    if (password && password !== user.password) {
      const salt = await require("bcrypt").genSalt(10);
      updatedData.password = await require("bcrypt").hash(password, salt);
    } else {
      updatedData.password = user.password; // giữ nguyên nếu giống
    }

    const updatedUser = await userService.updateUserById(userId, updatedData);

    if (updatedUser) {
      return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUser,
  updateUser,
};
