import { Router } from "express";
import multer from "multer";
import userController from "../Controllers/user.controller.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/edit", upload.single("image"), userController.handleEditInfo);
router.post("/change-password", userController.handleChangePassword);

export default router;
