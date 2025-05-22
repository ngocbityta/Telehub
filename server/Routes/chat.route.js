import { Router } from "express";
import chatController from "../controllers/chat.controller.js";

const router = Router();

router.put("/delete/:cid", chatController.handleDeleteConversation);

export default router;
