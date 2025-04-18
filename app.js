import express from "express";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import phraseRoutes from "./routes/phraseRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Phrases from "./models/phraseModel.js";
import postRoutes from "./routes/postRoutes.js";
import bodyParser from "body-parser";

const app = express();


// 连接数据库
connectDB();

async function createIndexes() {
    try {
        await Phrases.createIndexes(); // 自动创建模型中定义的索引
        console.log("✅ 索引创建成功");
    } catch (error) {
        console.error("❌ 创建索引失败:", error);
    }
}

// 在连接数据库后创建索引
createIndexes();

// 使用路由
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", categoryRoutes);
app.use("/api", phraseRoutes);
app.use("/api", translateRoutes);
app.use('/api', userRoutes);
app.use("/api", postRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
