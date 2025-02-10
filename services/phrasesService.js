import Phrases from "../models/phraseModel.js";

const getPhrasesByCategory = async (categoryKey) => {
    try {
        const phrases = await Phrases.find({ category_key: categoryKey });
        return phrases;
    } catch (error) {
        throw new Error("Error fetching phrases");
    }
};

export { getPhrasesByCategory };
