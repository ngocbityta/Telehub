import { Router } from "express";
import aiController from "../controllers/ai.controller.js";

const router = Router();
router.post("/reply", aiController.getGeminiResponseFromMessages);

export default router;
