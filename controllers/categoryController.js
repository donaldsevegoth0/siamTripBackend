import { getCategories } from "../services/categoryService.js";

const getAllCategories = async (req, res) => {
    try {
        const categories = await getCategories();
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllCategories };
