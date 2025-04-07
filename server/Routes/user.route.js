const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user.controller");
const validate = require("../middlewares/validateRequest");
const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require("../Validators/user.validator");

router.post("/register", validate(registerSchema), userController.registerUser);

router.post("/login", validate(loginSchema), userController.loginUser);

router.get("/", userController.getUser);

router.get("/:userId", userController.findUser);

router.put("/:userId", validate(updateUserSchema), userController.updateUser);

module.exports = router;
