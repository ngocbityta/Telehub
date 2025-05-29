import { Router } from "express";
import friendController from "../controllers/friend.controller.js";

const router = Router();

router.post("/edit-friend-list", friendController.editFriendList);
router.post("/get-friend-list", friendController.getFriendList);
router.post("/create-friend-request", friendController.createFriendRequest);
router.post("/response-friend-request", friendController.responseFriendRequest);
router.post("/get-friend-request-list", friendController.getFriendRequestList);
router.post("/search-friends", friendController.searchFriends);

export default router;
