import express from "express";
import { getTranslations } from "file:///E:/siamTripBackend/controllers/translationController.js";

const router = express.Router();

router.post("/translate", getTranslations);

export default router;
