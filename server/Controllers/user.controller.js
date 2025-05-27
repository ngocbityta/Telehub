import userService from "../services/user.service.js";

const handleEditInfo = async (req, res) => {
  try {
    const user = await userService.editUserInfo(
      req.userId,
      req.username,
      req.file,
      req.body
    );
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const handleChangePassword = async (req, res) => {
  try {
    const result = await userService.changePassword(
      req.userId,
      req.body.oldPassword,
      req.body.newPassword,
      req.body.matchPassword
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.body);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export default { handleEditInfo, handleChangePassword, getUserById, getUser };
