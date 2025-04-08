const express = require("express");
const router = express.Router();
const chatController = require("../Controllers/chat.controller");
const validate = require("../Validators/validateRequest");
const { createChatSchema } = require("../Validators/chat.validator");

router.post("/", validate(createChatSchema), chatController.createChat);

router.get("/:userId", chatController.findUserChats);

router.get("/:firstId/:secondId", chatController.findChat);

module.exports = router;
