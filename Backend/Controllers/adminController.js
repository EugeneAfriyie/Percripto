import validator from 'validator';
import bycrypt, { hash } from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../model/doctorModel.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';



// APIFOR ADDING DOCTORS

const addDoctor = async (req, res ) =>{
    try {

        const { name, email, password, speciality, degree,experience,about,fee,address } = req.body;

        const imagefile = req.file;

        // check for all fields 
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fee || !address) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // validaing email format 
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        // validing stong length of password 

        // if (!validator.isStrongPassword(password)) {
        //     return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol' });
        // }

         if(password.length < 8){
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
         }


        //  hashing the password 
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        //  upload img to cloudinary and get the url
        const imageUrl = imagefile ? imagefile.path : null;

       const uploadimg = await cloudinary.uploader.upload(imageUrl, {
        // folder: 'doctors',
        // use_filename: true,
        // unique_filename: false,
        resource_type: 'image'
       }) 
       const imgUrl = uploadimg.secure_url;


       const doctorData = {
        name,
        email,
        password: hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fee,
        address: JSON.parse(address),
        image: imgUrl,
        date: new Date()
       }

       

       const newDoctor = new doctorModel(doctorData);
       await newDoctor.save();
         res.status(201).json({ success: true, message: 'Doctor added successfully' });

        


        
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
}

// API TO GET ALL DOCTORS
const allDoctors = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
}

// api for admin login 

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;


        console.log("Email:", email);
console.log("Password:", password);
console.log("Expected:", process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ success: true, message: 'Admin logged in successfully', token });
} else {
    console.log("Invalid credentials reached!");
    return res.json({ success: false, message: 'Invalid email or password' });
}

        // 1. Check if env variables are loaded (Debugging)
        if (!process.env.ADMIN_EMAIL || !process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Server configuration missing" });
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            // 2. FIX: Pass an object to jwt.sign
            // Also, don't include the password in the token payload for security!
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' }); 

            return res.status(200).json({ 
                success: true, 
                message: 'Admin logged in successfully', 
                token 
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        // This ensures the frontend ALWAYS gets JSON even on crash
        res.status(500).json({ success: false, message: error.message });
    }
}

export  {addDoctor,adminLogin,allDoctors}; 