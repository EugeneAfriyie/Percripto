import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/Cloudinary.js";


// pp config
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
connectDB()
connectCloudinary()

// middleware 
app.use(express.json());
app.use(cors());

//  api endpoints
app.get("/", (req, res) => {
    res.send("Hello Api is working fine!");
});

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});