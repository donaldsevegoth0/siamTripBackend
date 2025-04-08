import pkg from 'jsonwebtoken';
import userService from '../services/userService.js';
import wxAPI from '../utils/wxAPI.js';

const login = async (req, res) => {
    const { code, avatarUrl, nickName } = req.body;

    if (!code) return res.status(400).json({ message: 'code 缺失' });

    const { openid } = await wxAPI.getOpenIdAndSessionKey(code);
    if (!openid) return res.status(500).json({ message: '获取 openid 失败' });

    let user = await userService.findUserByOpenId(openid);
    if (!user) {
        user = await userService.createUser(openid, avatarUrl, nickName);
    }

    const token = pkg.sign({ id: user._id, openid: user.openid }, 'SIAMTRIP_a84b9c9b2b32417d8e1caa7f491e837c', { expiresIn: '7d' });
    res.json({ token });
};

export default { login };

