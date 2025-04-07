const express = require("express");
const router = express.Router();
const messageController = require("../Controllers/message.controller");
const validate = require("../middlewares/validateRequest");
const { messageSchema } = require("../Validators/message.validator");

router.post("/", validate(messageSchema), messageController.createMessage);

router.get("/:chatId", messageController.getMessage);

module.exports = router;
