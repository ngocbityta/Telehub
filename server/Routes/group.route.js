import { Router } from "express";
import multer from "multer";
import groupController from "../Controllers/group.controller.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/create",
  upload.single("image"),
  groupController.handleCreateGroup
);
router.put(
  "/edit/:id",
  upload.single("image"),
  groupController.handleEditGroup
);
router.get("/findUser", groupController.handleFindUser);
router.get("/owned", groupController.handleGetGroups);
router.put("/leave/:cid", groupController.handleLeaveGroup);
router.delete("/:cid", groupController.handleDeleteGroup);

export default router;
