import translationText from "../services/addPhraseService.js";

const getTranslations = async (req, res) => {
    try {
        const translations = await translationText(req.body.text);
        res.json({ translations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getTranslations };
