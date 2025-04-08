import { Schema, model } from 'mongoose';
import User from './userModel.js'; // 引入 User 模型

const postSchema = new Schema({
    title: { type: String, required: true }, // 标题
    describe: { type: String, required: true }, // 描述
    location: { type: String, required: true }, // 地点
    images: [{ type: String }], // 图片 URL 数组
    tag: [{ type: String }], // 标签数组
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // 记录创建者
    favoritedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ], // 记录收藏者
    likes: { type: Number, default: 0 }, // 点赞数
    shares: { type: Number, default: 0 }, // 转发数
    views: { type: Number, default: 0 }, // 观看数
}, { timestamps: true });

const Post = model('Post', postSchema);

export default Post;

