import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../model/userModel.js';
import jwt from 'jsonwebtoken';

// API TO REGISTER USER
const registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      date: new Date()
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API FOR LOGIN USER 
const loginuser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Invalid email format' });
        }

        if (password.length < 8) {_
            return res.json({success: false, message: 'Password must be at least 8 characters long'})
        } 
        
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.json({ success: false, message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                success: true,
                message: 'User logged in successfully',
                token
            });
              
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
}

export { registeruser };
export { loginuser };