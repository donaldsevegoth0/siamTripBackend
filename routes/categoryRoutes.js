import express from "express";
import { getAllCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getAllCategories);   // 获取所有分类

export default router;
