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

const increasePostView = async (req, res) => {
    const { postId } = req.params; // 从请求参数中获取 postId

    try {
        const updatedPost = await postService.increaseViewCount(postId); // 调用 service 来增加播放量
        res.status(200).json(updatedPost); // 返回更新后的帖子
    } catch (error) {
        res.status(500).json({ message: error.message }); // 错误处理
    }
};

// 处理点赞请求
const handleLike = async (req, res) => {
    try {
        const { postId } = req.params;  // 从请求参数中获取 postId
        const updatedPost = await postService.incrementLikeCount(postId);  // 调用 Service 层的函数
        res.status(200).json(updatedPost);  // 返回更新后的帖子
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 处理分享请求
const handleShare = async (req, res) => {
    try {
        const { postId } = req.params;  // 从请求参数中获取 postId
        const updatedPost = await postService.incrementShareCount(postId);  // 调用 Service 层的函数
        res.status(200).json(updatedPost);  // 返回更新后的帖子
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 创建新帖子
const createPost = async (req, res) => {
    try {
        const { title, describe, location, images, tag, createdBy } = req.body;

        // 调用 service 层的业务逻辑
        const newPost = await postService.createPost({ title, describe, location, images, tag, createdBy });

        // 返回成功的响应
        res.status(200).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.query;  // 从请求参数获取 userId

        // 调用 service 获取该用户的所有帖子
        const posts = await postService.getUserPosts(userId);

        // 如果没有找到帖子，返回空数组
        if (!posts) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        // 返回获取到的帖子数据
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

const searchPosts = async (req, res) => {
    try {
        const { query } = req.query; // 从查询参数中获取查询内

        // 调用服务层进行搜索
        const posts = await postService.searchPosts(query);
        // 返回找到的帖子
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error in searchPosts controller:', error);
        res.status(500).json({ message: '服务器错误，无法搜索帖子' });
    }
}

export default {
    getUserPosts, getPosts, getTop10RecommendedPosts, increasePostView, handleLike, handleShare, createPost, searchPosts
};
