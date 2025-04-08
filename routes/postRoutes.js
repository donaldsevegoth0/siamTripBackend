// routes/postRouter.js
import { Router } from 'express';
const router = Router();
import postController from '../controllers/postController.js';  // 引入 postController

// 定义路由并映射到 controller
router.get('/posts', postController.getPosts);  // 获取所有帖子
import express from 'express';

// 获取推荐帖子
router.get('/recommended', postController.getTop10RecommendedPosts);


export default router;
