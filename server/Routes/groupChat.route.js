const express = require("express");
const router = express.Router();

const groupChatController = require("../Controllers/groupChat.controller");
const validate = require("../Validators/validateRequest");
const {
  createGroupChatSchema,
  updateGroupChatSchema,
} = require("../Validators/groupChat.validator");

router.post(
  "/",
  validate(createGroupChatSchema),
  groupChatController.createGroupChat
);

router.get("/", groupChatController.getAllGroupChats);

router.get("/:id", groupChatController.getGroupChatById);

router.put(
  "/:id",
  validate(updateGroupChatSchema),
  groupChatController.updateGroupChat
);

router.delete("/:id", groupChatController.deleteGroupChat);

module.exports = router;
