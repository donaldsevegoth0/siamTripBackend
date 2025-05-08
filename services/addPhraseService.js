import axios from "axios";
import Phrases from "../models/phraseModel.js";
import dotenv from 'dotenv';

dotenv.config();
const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;
const TTS_URL = `${process.env.TTS_URL}${GOOGLE_TTS_API_KEY}`;

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

console.log("GitHub token length:", GITHUB_TOKEN?.length);




async function translateText(chinese) {
    const baseUrl = 'https://translation.googleapis.com/language/translate/v2';

    try {
        const [resTh, resEn] = await Promise.all([
            axios.post(baseUrl, {
                q: chinese,
                source: 'zh',
                target: 'th',
                format: 'text'
            }, {
                params: { key: GOOGLE_TRANSLATE_API_KEY }
            }),

            axios.post(baseUrl, {
                q: chinese,
                source: 'zh',
                target: 'en',
                format: 'text'
            }, {
                params: { key: GOOGLE_TRANSLATE_API_KEY }
            })
        ]);

        return {
            thai: resTh.data.data.translations[0].translatedText,
            english: resEn.data.data.translations[0].translatedText
        };
    } catch (error) {
        console.error('Translation Error:', error.response?.data || error.message);
        throw new Error('Translation failed');
    }
}


// 2. 生成 TTS 音频数据（不存本地）
async function getTextToSpeechBase64(thaiText) {
    try {
        const response = await axios.post(TTS_URL, {
            input: { text: thaiText },
            voice: { languageCode: "th-TH", ssmlGender: "FEMALE" },
            audioConfig: { audioEncoding: "MP3" }
        });

        return response.data.audioContent; // 直接返回 base64 数据
    } catch (error) {
        console.error("TTS Error:", error.response?.data || error.message);
        throw new Error("TTS failed");
    }
}

// 检查是否已存在相似的中文内容
async function checkSimilarContent(chineseText) {
    const existingPhrase = await Phrases.findOne({ $text: { $search: chineseText } });
    return existingPhrase;
}

// 3. 直接上传 base64 音频数据到 GitHub
async function uploadBase64ToGitHub(base64Audio, fileName) {
    try {
        const response = await axios.put(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/audio/${fileName}`,
            {
                message: `Add ${fileName}`,
                content: base64Audio // 直接上传 base64
            },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json"
                }
            }
        );

        return response.data.content.download_url;
    } catch (error) {
        console.error("GitHub Upload Error:", error.response?.data || error.message);
        throw new Error("Upload to GitHub failed");
    }
}

// 4. 处理整个流程（翻译、TTS、上传 GitHub、存入数据库）
async function addPhraseService({ category, chinese, types }) {
    try {
        // 检查是否有相似内容
        const existingPhrase = await checkSimilarContent(chinese);
        if (existingPhrase) {
            console.log("❌ 数据库中已存在相似的中文内容");
            return { success: false, message: "已存在相似的中文内容" };
        }

        // 翻译文本
        const { english, thai } = await translateText(chinese);

        // 生成 MP3 base64（文件名 = 翻译后的英文）
        const base64Audio = await getTextToSpeechBase64(thai);
        const fileName = `${english.replace(/\s+/g, "_")}.mp3`; // 确保文件名合法

        // 上传 MP3 到 GitHub
        const audioUrl = await uploadBase64ToGitHub(base64Audio, fileName);

        // 存入数据库
        const newPhrase = await Phrases.create({
            category_key: category,
            content: english,
            English: english,
            chinese: chinese,
            thai: thai,
            type: types,
            audio_url: audioUrl
        });

        return { success: true, data: newPhrase };
    } catch (error) {
        console.error("Process Error:", error.message);
        return { success: false, message: error.message };
    }
}

export default addPhraseService;
