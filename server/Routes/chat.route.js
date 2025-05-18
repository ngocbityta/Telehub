import { Router } from "express";
import chatController from "../Controllers/chat.controller.js";

const router = Router();

router.put("/delete/:cid", chatController.handleDeleteConversation);

export default router;
