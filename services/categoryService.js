import Phrases from "../models/phraseModel.js";

const getCategories = async () => {
    try {
        const categories = await Phrases.distinct("category_key");;
        return categories;
    } catch (error) {
        throw new Error("Error fetching categories");
    }
};

export { getCategories };
