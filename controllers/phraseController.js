import { getPhraseDetail } from "../services/phraseService.js";
import { getPhrasesByCategory } from "../services/phrasesService.js";
import { getNormalPhrases } from "../services/normalPhraseService.js";

const getPhrases = async (req, res) => {
    try {
        const phrases = await getPhrasesByCategory(req.params.categoryKey);
        res.json({ phrases });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPhrase = async (req, res) => {
    try {
        const phrase = await getPhraseDetail(req.params.phraseID);
        res.json({ phrase });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNormalPhrasesList = async (req, res) => {
    try {
        const phrases = await getNormalPhrases();
        res.json({ phrases });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getPhrases, getPhrase, getNormalPhrasesList };


