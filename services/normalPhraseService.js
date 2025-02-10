import Phrases from "../models/phraseModel.js";

const getNormalPhrases = async () => {
    try {
        const phrases = await Phrases.find({ type: "normal" });

        if (!phrases) {
            throw new Error("Phrases not found");
        }

        return phrases;
    } catch (error) {
        console.error("Error fetching phrase:", error.message);
        throw new Error("Error fetching phrase");
    }
};

export { getNormalPhrases };