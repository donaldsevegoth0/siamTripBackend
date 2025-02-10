import express from "express";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import phraseRoutes from "./routes/phraseRoutes.js";

const app = express();

// 连接数据库
connectDB();

// 使用路由
app.use("/api", categoryRoutes);
app.use("/api", phraseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
