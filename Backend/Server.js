import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/Cloudinary.js";
import { adminRouter } from "./routes/adminRoute.js";
import { doctorRouter } from "./routes/doctorRoute.js";


// pp config
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
connectDB()
connectCloudinary()

// middleware 
app.use(express.json());
// app.use(cors());

//  api endpoints
app.use("/api/admin",adminRouter)
app.use("/api/doctor",doctorRouter)
// localhost:5000/api/admin/

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});