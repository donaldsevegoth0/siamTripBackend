// services/postService.js
import Post from '../models/postsModel.js';  // 引入 Post 模型

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
                            { $multiply: [{ $subtract: [new Date(), "$createdAt"] }, 0.1] }  // 时间权重占 10%
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

export default {
    getAllPosts, getTop10RecommendedPosts
};
