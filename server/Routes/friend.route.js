import { Router } from "express";
import friendController from "../controllers/friend.controller.js";

const router = Router();

router.post("/editFriendList", friendController.editFriendList);
router.post("/getFriendList", friendController.getFriendList);

export default router;
