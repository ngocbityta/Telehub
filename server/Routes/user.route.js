import { Router } from "express";
import multer from "multer";
import userController from "../controllers/user.controller.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/edit", upload.single("image"), userController.handleEditInfo);
router.post("/change-password", userController.handleChangePassword);
router.get("/:userId", userController.getUserById);
router.post("/get-users", userController.getUsers);

export default router;
