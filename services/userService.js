import User from '../models/userModel.js';

const findUserByOpenId = async (openid) => {
    return await User.findOne({ openid });
};

const createUser = async (openid, avatarUrl, nickName) => {
    return await User.create({ openid, avatarUrl, nickName });
};

export default { findUserByOpenId, createUser };
