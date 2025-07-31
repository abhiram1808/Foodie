import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI not set in .env file");
    }
    await mongoose.connect(uri)
        .then(() => console.log("DB Connected"))
        .catch((err) => {
            console.error("DB Connection Error:", err);
            process.exit(1);
        });
}