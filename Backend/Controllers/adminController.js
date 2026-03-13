import validator from 'validator';
import bycrypt, { hash } from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../model/doctorModel.js';


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


export  {addDoctor};