import express from "express";
import { getPhrases } from "../controllers/phraseController.js";
import { getPhrase, getNormalPhrasesList } from "../controllers/phraseController.js";
import addPhraseController from "../controllers/addPhraseController.js";
const router = express.Router();

router.get("/phrases/:categoryKey", getPhrases); // 获取某个分类下的所有短语
router.get("/phrase/:phraseID", getPhrase);
router.get("/normal", getNormalPhrasesList);
router.post("/addPhrase", addPhraseController);
export default router;
