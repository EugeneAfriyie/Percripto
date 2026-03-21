import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import doctorModel from './model/doctorModel.js';

const doctorsList = [
    {
        name: 'Dr. Richard James',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Emily Larson',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Sarah Patel',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Christopher Lee',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Jennifer Garcia',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Andrew Williams',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Christopher Davis',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Timothy White',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Ava Mitchell',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Jeffrey King',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Zoe Kelly',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Patrick Harris',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Chloe Evans',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Ryan Martinez',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        name: 'Dr. Amelia Hill',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    }
];

const seedDatabase = async () => {
    try {
        // 1. Connect to MongoDB
        await connectDB();
        console.log("Connected to MongoDB. Starting seed...");

        // 2. Clear existing doctors (Optional: Comment this out if you don't want to wipe current doctors)
        await doctorModel.deleteMany({});
        console.log("Cleared existing doctors from the database.");

        // 3. Hash a default password "password123" for all doctors
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 4. Map the data to include emails, passwords, and a placeholder image
        const doctorsToInsert = doctorsList.map((doc) => {
            // Create an email from the doctor's name (e.g., Dr. Richard James -> richardjames@example.com)
            const generatedEmail = doc.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@example.com';
            
            return {
                ...doc,
                email: generatedEmail,
                password: hashedPassword,
                // Since we aren't uploading to Cloudinary here, we provide a dummy image placeholder
                image: 'https://via.placeholder.com/200x200.png?text=Doctor+Image',
                date: new Date()
            };
        });

        // 5. Insert into MongoDB
        await doctorModel.insertMany(doctorsToInsert);
        console.log(`Successfully added ${doctorsToInsert.length} doctors to the database!`);

        // Exit process
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();