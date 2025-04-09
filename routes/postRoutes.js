// routes/postRouter.js
import { Router } from 'express';
const router = Router();
import postController from '../controllers/postController.js';  // 引入 postController

// 定义路由并映射到 controller
router.get('/posts', postController.getPosts);  // 获取所有帖子

// 获取推荐帖子
router.get('/recommended', postController.getTop10RecommendedPosts);
router.patch('/posts/:postId/views', postController.increasePostView);
router.patch('/:postId/likes', postController.handleLike);
router.patch('/:postId/shares', postController.handleShare);
router.post('/postNewPlan', postController.createPost);
router.get('/userPosts', postController.getUserPosts);
router.get('/searchPosts', postController.searchPosts);
router.patch('/:postId/favorite', postController.handleFavorite);
router.get('/:userId/collections', postController.getUserCollection);

export default router;
