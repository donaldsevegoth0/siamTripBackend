import { Schema, model, connect } from 'mongoose';

const phraseSchema = new Schema({
    category_key: { type: String, required: true },
    content: { type: String, required: true },
    English: { type: String },
    chinese: { type: String },
    thai: { type: String },
    type: { type: Array },
    audio_url: { type: String }
});

const Phrase = model('Phrase', phraseSchema);

connect('mongodb+srv://zishungao:gzmtgzs52nm@cluster0.oaw9o.mongodb.net/siamTrip', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const phrases = [
    { category_key: 'greetings', content: '你好', English: 'Hello', chinese: '你好', thai: 'สวัสดี', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/hello.mp3' },
    { category_key: 'greetings', content: '谢谢', English: 'Thank you', chinese: '谢谢', thai: 'ขอบคุณ', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/thanks.mp3' },
    { category_key: 'food&shopping', content: '菜单', English: 'menu', chinese: '菜单', thai: 'เมนู', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/menu.mp3' },
    { category_key: 'food&shopping', content: '这个辣吗？', English: 'Is it spicy?', chinese: '这个辣吗？', thai: 'เผ็ดไหม?', type: ['normal', 'question'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/spicy.mp3' },
    { category_key: 'food&shopping', content: '不要辣', English: 'no spicy', chinese: '不要辣', thai: 'ไม่เผ็ด', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/noSpicy.mp3' },
    { category_key: 'food&shopping', content: '结账', English: 'check the bill', chinese: '结账', thai: 'เช็คบิล', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/checkBill.mp3' },
    { category_key: 'transportation', content: '多少钱？', English: 'how much?', chinese: '多少钱？', thai: 'ราคาเท่าไหร่?', type: ['normal', 'calculator'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/howMuch.mp3' },
    { category_key: 'transportation', content: '停', English: 'stop', chinese: '停', thai: 'หยุด', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/stop.mp3' },
    { category_key: 'hotel', content: '我有预订', English: 'I have reservation', chinese: '我有预订', thai: 'ฉันมีการจอง', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/haveReservation.mp3' },
    { category_key: 'hotel', content: '退房', English: 'check out', chinese: '退房', thai: 'เช็คเอาท์', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/checkOut.mp3' },
    { category_key: 'hotel', content: '什么时候退房？', English: 'when is check out time?', chinese: '什么时候退房？', thai: 'เวลาเช็คเอาท์เมื่อไหร่?', type: ['calculator'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/checkOutTime.mp3' },
    { category_key: 'emergency', content: '我需要帮助', English: 'I need help', chinese: '我需要帮助', thai: 'ฉันต้องการความช่วยเหลือ', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/needHelp.mp3' },
    {
        category_key: 'emergency', content: '我生病了', English: 'I\'m sick', chinese: '我生病了', thai: 'ฉันป่วย', type: ['normal'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/iSick.mp3'
    },
    { category_key: 'entertainment', content: '我可以拍照吗？', English: 'May I take a pic?', chinese: '我可以拍照吗？', thai: 'ฉันถ่ายรูปได้ไหม?', type: ['normal', 'question'], audio_url: 'https://raw.githubusercontent.com/donaldsevegoth0/siamTripAudio/main/audio/takePhotoAsk.mp3' }
];

async function updateDatabase() {
    for (const phrase of phrases) {
        await Phrase.findOneAndUpdate(
            { category_key: phrase.category_key, content: phrase.content },
            phrase,
            { upsert: true, new: true }
        );
    }
    console.log('Database Updated');
}

updateDatabase().catch(console.error);