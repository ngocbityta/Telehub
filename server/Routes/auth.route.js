import { Router } from "express";
import authController from "../Controllers/auth.controller.js";

const router = Router();

router.post("/", authController.handleLogin);
router.post("/google", authController.handleGoogleLogin);
router.post("/forgot", authController.handleForget);
router.post("/recover", authController.handleRecover);
router.post("/verify", authController.handleVerifyToken);
router.post("/logout", authController.handleLogout);
router.post("/register", authController.handleRegister);
router.post("/refreshToken", authController.handleRefreshToken);

export default router;
