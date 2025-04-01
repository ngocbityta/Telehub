const express = require("express");
const { createMessage,getMessage} = require("../Controllers/messageController");


const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessage);


module.exports = router;