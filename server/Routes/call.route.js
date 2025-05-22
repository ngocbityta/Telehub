import { Router } from "express";
import callController from "../controllers/call.controller.js";

const router = Router();

router.get("/", callController.handleCreateCall);

export default router;
