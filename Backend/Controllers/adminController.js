import validator from 'validator';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../model/doctorModel.js';
import appointmentModel from '../model/appointmentModel.js';
import 'dotenv/config';
import userModel from '../model/userModel.js';
import adminModel from '../model/adminModel.js';



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

        // Check if env variables are loaded
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
            console.error("Admin environment variables are not set.");
            return res.status(500).json({ success: false, message: "Server configuration missing" });
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const existingAdmin = await adminModel.findOne({ email });

            if (!existingAdmin) {
                await adminModel.create({
                    email,
                    name: 'Admin',
                });
            }
            
            // The payload should identify the user as an admin.
            // Note: This token will not work on user-only routes that expect a user `id`.
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
        res.status(500).json({ success: false, message: error.message });
    }
}

const getAdminProfile = async (req, res) => {
    try {
        const email = req.adminEmail;

        let admin = await adminModel.findOne({ email });

        if (!admin) {
            admin = await adminModel.create({
                email,
                name: 'Admin',
            });
        }

        return res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error('Error getting admin profile:', error);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
}

const updateAdminProfile = async (req, res) => {
    try {
        const email = req.adminEmail;
        const { name } = req.body;
        const imagefile = req.file;

        let admin = await adminModel.findOne({ email });

        if (!admin) {
            admin = await adminModel.create({
                email,
                name: name || 'Admin',
            });
        }

        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (imagefile) {
            const uploadimg = await cloudinary.uploader.upload(imagefile.path, {
                resource_type: 'image'
            });

            updateData.image = uploadimg.secure_url;
        }

        const updatedAdmin = await adminModel.findOneAndUpdate(
            { email },
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Admin profile updated successfully',
            admin: updatedAdmin
        });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
}

// API TO GET ALL APPOINTMENT OF A DOCTOR 
const adminListAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
}

// API TO CANCEL APPOINTMENT  
const cancelAppointment = async (req, res) => {

  try {
    const {appointmentId} = req.body;
    // const userId = req.user;
    const appointmentData = await appointmentModel.findById(appointmentId);


    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true},{new:true})

    //  releasing doc slot
    const { docId ,slotdate,slotTime} = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    let slot_booked = doctorData.slots_booked;

   slot_booked[slotdate] = slot_booked[slotdate].filter((time) => time !== slotTime);

   await doctorModel.findByIdAndUpdate(
    docId,
    { slots_booked: slot_booked },
    { returnDocument: 'after' }
  );

    res.status(200).json({ success: true, message: "Appointment cancelled successfully" });
 
  } catch (error) {
    console.log(error)
      res.status(500).json({ success: false, message: error.message });
  }
}


// API TO GET DASHBOARD DATA FOR ADMIN 

const getDashboardData = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const appointments = await appointmentModel.find({});
        const users = await userModel.find({});

        const dashData = {
            doctors: doctors.length,
            appointments:  appointments.length,
            users:users.length,
            patients: users.length,
            latestAppointments: appointments.slice(-5).reverse()
        }

        res.status(200).json({ success: true, dashData });



    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
}





export  {addDoctor,adminLogin,allDoctors,adminListAppointments,cancelAppointment,getDashboardData,getAdminProfile,updateAdminProfile}; 
