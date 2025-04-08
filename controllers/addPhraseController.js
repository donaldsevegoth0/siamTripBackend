import addPhraseService from "../services/addPhraseService.js";

const addPhraseController = async (req, res) => {
    const { category, chinese, types } = req.body;

    if (!category || !chinese || !types) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await addPhraseService({ category, chinese, types });

    if (result.success) {
        return res.status(201).json({ success: true, data: result.data });
    } else {
        return res.status(500).json({ message: result.message });
    }
};

export default addPhraseController;
