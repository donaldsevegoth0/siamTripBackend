import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    openid: { type: String, required: true, unique: true },
    avatarUrl: String,
    nickName: String,
    createdAt: { type: Date, default: Date.now }
});

export default model('User', userSchema);

