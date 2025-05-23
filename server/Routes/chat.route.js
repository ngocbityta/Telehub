import { Router } from "express";
import chatController from "../controllers/chat.controller.js";

const router = Router();

router.put("/delete/:cid", chatController.handleDeleteConversation);
router.get("/media/:cid", chatController.getMediaFromConservation);
router.get("/files/:cid", chatController.getFilesFromConversation);
router.post("/search/:cid", chatController.searchMessageFromConversation);

export default router;
