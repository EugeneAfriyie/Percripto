import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {


    // 1. Setup the listener first
    mongoose.connection.on("connected", () => {
        console.log("✅ MongoDB connected successfully to MediApo_Project");
    });

    mongoose.connection.on("error", (err) => {
        console.log("❌ MongoDB connection error:", err);
    });

    try {
        // 2. Attempt the connection
        await mongoose.connect(`${process.env.MONGODB_URL}/mediApo_Project`);
        
    } catch (error) {
        console.error("Critical Error: Could not connect to MongoDB", error);
        process.exit(1); // Stop the app if the DB fails
    }
}

export default connectDB;