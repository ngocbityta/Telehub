const userModel = require("../Models/user.model");
const bcrypt = require("bcrypt");

const findUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

const findUserById = async (userId) => {
  return await userModel.findById(userId);
};

const getAllUsers = async () => {
  return await userModel.find();
};

const createUser = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new userModel({ name, email, password: hashedPassword });
  return await user.save();
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const updateUserById = async (userId, updateData) => {
  return await userModel.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  getAllUsers,
  createUser,
  comparePassword,
  updateUserById,
};
