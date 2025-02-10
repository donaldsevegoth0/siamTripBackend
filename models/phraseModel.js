import mongoose from "mongoose";

const phraseSchema = new mongoose.Schema({
    category_key: { type: String, required: true },
    content: { type: String, required: true },
    English: { type: String },
    chinese: { type: String },
    thai: { type: String },
    type: { type: [String] },
    audio_url: { type: String }
});

const Phrases = mongoose.model("Phrases", phraseSchema);

export default Phrases;
