import Phrases from "../models/phraseModel.js";
import mongoose from "mongoose";

const getPhraseDetail = async (phraseID) => {
    try {
        // Ensure phraseID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(phraseID)) {
            throw new Error("Invalid phrase ID format");
        }

        // Find by _id
        const phrase = await Phrases.findById(new mongoose.Types.ObjectId(phraseID));

        if (!phrase) {
            throw new Error("Phrase not found");
        }

        return phrase;
    } catch (error) {
        console.error("Error fetching phrase:", error.message);
        throw new Error("Error fetching phrase");
    }
};

export { getPhraseDetail };