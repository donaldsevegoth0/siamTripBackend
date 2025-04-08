// controllers/postController.js
import postService from '../services/postService.js';  // 引入 postService

// 获取所有帖子
const getPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();  // 调用 service 获取帖子
        res.status(200).json(posts);  // 返回帖子数据
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts', error: err.message });
    }
};


// 获取推荐帖子
const getTop10RecommendedPosts = async (req, res) => {
    try {
        const topPosts = await postService.getTop10RecommendedPosts();
        res.status(200).json(topPosts);  // 返回前 10 条推荐帖子
    } catch (err) {
        res.status(500).json({ message: 'Error fetching top recommended posts', error: err });
    }
};

export default {
    getPosts, getTop10RecommendedPosts
};
