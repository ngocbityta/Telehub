import { Router } from "express";
import goongController from "../controllers/goong.controller.js";

const router = Router();

router.post("/reverse-geocoding", goongController.reverseGeocoding);
router.post("/forward-geocoding", goongController.forwardGeocoding);

export default router;
