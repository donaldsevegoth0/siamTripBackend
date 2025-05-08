// services/postService.js
import Post from '../models/postsModel.js';  // 引入 Post 
import User from "../models/userModel.js";
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();


// 获取所有帖子
const getAllPosts = async () => {
    try {
        const posts = await Post.find();
        return posts;
    } catch (err) {
        throw new Error('Error fetching posts', err);
    }
};

// 推荐算法函数
const getTop10RecommendedPosts = async () => {
    try {
        const posts = await Post.aggregate([
            {
                $addFields: {
                    // 给每个帖子一个推荐评分
                    score: {
                        $add: [
                            { $multiply: ["$likes", 0.4] },   // 点赞数占 40%
                            { $multiply: ["$shares", 0.3] },  // 转发数占 30%
                            { $multiply: ["$views", 0.2] },   // 观看数占 20%
                        ]
                    }
                }
            },
            {
                $sort: { score: -1 }  // 按照计算出的评分从高到低排序
            },
            {
                $limit: 10  // 只返回前 10 条帖子
            }
        ]);

        return posts;
    } catch (err) {
        console.error('Error fetching top recommended posts:', err);
        throw err;
    }
};

const increaseViewCount = async (postId) => {
    try {
        const post = await Post.findById(postId); // 查找指定 ID 的帖子
        if (!post) {
            throw new Error('Post not found');
        }

        post.views += 1; // 播放量 +1
        await post.save({ validateBeforeSave: false }); // 保存更新后的帖子数据

        return post; // 返回更新后的帖子
    } catch (error) {
        throw new Error('Error increasing view count: ' + error.message);
    }
};

// 更新点赞数
const incrementLikeCount = async (postId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        post.likes += 1;  // 点赞数增加
        await post.save({ validateBeforeSave: false });  // 跳过验证，直接保存

        return post;
    } catch (error) {
        throw new Error(`Error updating like count: ${error.message}`);
    }
};

// 更新分享数
const incrementShareCount = async (postId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        post.shares += 1;  // 转发数增加
        await post.save({ validateBeforeSave: false });  // 跳过验证，直接保存

        return post;
    } catch (error) {
        throw new Error(`Error updating share count: ${error.message}`);
    }
};

const createPost = async ({ title, describe, location, images, tag, createdBy }) => {
    try {
        // 确保传入的必填字段不为空
        if (!title || !describe || !location || !createdBy) {
            throw new Error('Missing required fields');
        }
        console.log(images);

        // 确保创建者存在
        const user = await User.findById(createdBy);
        if (!user) {
            throw new Error('User not found');
        }

        // 上传所有图片到 GitHub，并获取它们的下载链接
        const imageLinks = [];
        for (let i = 0; i < images.length; i++) {
            const base64Image = images[i]; // images 是包含 base64 编码的图片数组
            const fileName = `${createdBy}-${i + 1}.jpg`; // 图片命名为 createdBy + 图片序号
            const imageUrl = await uploadImageToGitHub(base64Image, fileName);
            imageLinks.push(imageUrl);
        }

        // 创建新的帖子
        const newPost = new Post({
            title,
            describe,
            location,
            images: imageLinks, // 将 GitHub 返回的图片链接存储在 images 字段中
            tag,
            createdBy
        });

        // 保存帖子到数据库
        await newPost.save();

        return newPost; // 返回新创建的帖子
    } catch (error) {
        throw new Error(error.message);
    }
};

async function uploadImageToGitHub(base64Image, fileName) {
    try {
        const response = await axios.put(
            `https://api.github.com/repos/${process.env.GITHUB_REPO_IMG}/contents/img/${fileName}`,
            {
                message: `Add ${fileName}`,
                content: base64Image // 直接上传 base64 编码的音频
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN_IMG}`,
                    Accept: "application/vnd.github.v3+json"
                }
            }
        );

        return response.data.content.download_url; // 返回图片的下载链接
    } catch (error) {
        console.error("GitHub Upload Error:", error.response?.data || error.message);
        throw new Error("Upload to GitHub failed");
    }
};


const getUserPosts = async (userId) => {
    try {
        // 查询当前用户的帖子，并根据需要关联 User 模型以便获取创建者信息
        const posts = await Post.find({ createdBy: userId }).populate('createdBy', 'name avatar');
        return posts;
    } catch (error) {
        console.error('Error fetching posts in service:', error);
        throw new Error('Error fetching posts');
    }
};

const searchPosts = async (query) => {
    try {
        // 如果没有提供查询内容，返回空数组
        if (!query) {
            return [];
        }

        // 模糊搜索标题、描述和位置（使用正则表达式）
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { describe: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ]
        });

        return posts;
    } catch (error) {
        console.error('Error in searchPosts service:', error);
        throw error;
    }
}

const addFavorite = async (postId, userId) => {
    try {
        // 查找帖子
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        console.log(post.favoritedBy);
        // 判断该用户是否已经收藏
        if (post.favoritedBy.some(fav => fav.toString() === userId)) {
            removeFavorite(postId, userId);
            throw new Error('You have already favorited this post');
        }

        // 将用户 ID 添加到收藏者数组中
        post.favoritedBy.push(userId);

        // 保存并返回更新后的帖子
        await post.save({ validateBeforeSave: false });
        return post;
    } catch (error) {
        throw new Error(`Error adding favorite: ${error.message}`);
    }
};

// 移除收藏
const removeFavorite = async (postId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        // 从收藏者数组中移除用户 ID
        post.favoritedBy = post.favoritedBy.filter(user => user.toString() !== userId);

        // 保存并返回更新后的帖子
        await post.save({ validateBeforeSave: false });
        return post;
    } catch (error) {
        throw new Error(`Error removing favorite: ${error.message}`);
    }
};

const getUserCollections = async (userId) => {
    try {
        const posts = await Post.find({ favoritedBy: userId });
        return posts;
    } catch (error) {
        throw new Error('Error fetching user collections: ' + error.message);
    }
};


export default {
    getUserCollections, getUserPosts, getAllPosts, getTop10RecommendedPosts, increaseViewCount, incrementLikeCount, incrementShareCount, createPost, searchPosts, addFavorite, removeFavorite
};
