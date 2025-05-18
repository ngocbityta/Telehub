import { Router } from "express";
import callController from "../Controllers/call.controller.js";

const router = Router();

router.get("/", callController.handleCreateCall);

export default router;
