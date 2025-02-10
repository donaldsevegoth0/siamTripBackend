import 'dotenv/config'
import mongoose from "mongoose";

// Replace with your actual MongoDB connection string
const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.oaw9o.mongodb.net/${process.env.DB_NAME}`;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected...");
    } catch (error) {
        console.error(error.message);
        process.exit(1); // 退出进程
    }
};

export default connectDB;
