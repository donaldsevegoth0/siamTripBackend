import axios from 'axios';

const getOpenIdAndSessionKey = async (code) => {
    const appid = 'wx7f340ebd80aee996';
    const secret = 'f6b03eaba12c0c3b4595266ee8d28505';

    const res = await axios.get(`https://api.weixin.qq.com/sns/jscode2session`, {
        params: {
            appid,
            secret,
            js_code: code,
            grant_type: 'authorization_code'
        }
    });

    return res.data;  // 包含 openid, session_key
};

export default { getOpenIdAndSessionKey };
