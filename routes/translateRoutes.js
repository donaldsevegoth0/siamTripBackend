import express from "express";
import { getTranslations } from "../controllers/translationController.js";

const router = express.Router();

router.post("/translate", getTranslations);

export default router;
