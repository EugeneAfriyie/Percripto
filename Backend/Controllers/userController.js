import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../model/userModel.js';
import jwt from 'jsonwebtoken';
import doctorModel from '../model/doctorModel.js';
import appointmentModel from '../model/appointmentModel.js';

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

// API TO GET USER DETAILS
const getUserDetails = async (req, res) => {
    try {
      const  userId = req.user;
      console.log(userId)
      const user = await userModel.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' , userId: "user not found" + userId});
      }
      res.json({ success: true, user });
      
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: error.message });
    }
}

const updateUser = async (req, res) => {
  try {
    const userId = req.user; // get from auth middleware
    let { name, address, phone, DOB, gender } = req.body;
    const imagefile = req.file;

    if (!name || !address || !phone || !DOB || !gender) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // ensure address is object
    address = typeof address === "string" ? JSON.parse(address) : address;

    // Prepare update data
    const updateData = { name, address, phone, DOB, gender };

    // Upload new image if provided
    if (imagefile) {
      const uploadimg = await cloudinary.uploader.upload(imagefile.path, {
        folder: "doctors",
        resource_type: "image",
      });
      updateData.image = uploadimg.secure_url;
    }

    // Update user
    // const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    const updatedUser = await userModel.findByIdAndUpdate(
  userId,
  updateData,
  { returnDocument: "after" }
);

    res.json({ success: true, message: "User profile updated", user: updatedUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



const bookAppointment = async (req, res) => {
  try {
    const {docId,slotdate,slotTime} = req.body;
    const userId = req.user;

    if (!docId || !slotdate || !slotTime) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const userdata = await userModel.findById(userId).select('-password');

    if (!userdata) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Atomically check for availability and book the slot to prevent race conditions
    const doctorData = await doctorModel.findOneAndUpdate(
      { 
        _id: docId, 
        available: true,
        [`slots_booked.${slotdate}`]: { $ne: slotTime } 
      },
      { 
        $push: { [`slots_booked.${slotdate}`]: slotTime } 
      },
      { new: true }
    ).select('-password');

    if (!doctorData) {
      return res.status(400).json({ success: false, message: "Slot already booked or doctor not available" });
    }

    // Convert to plain object and remove slots_booked to save in appointment history
    const doctorObj = doctorData.toObject ? doctorData.toObject() : JSON.parse(JSON.stringify(doctorData));
    delete doctorObj.slots_booked;
    
    const appointmentData = {
      userId,
      docId,
      slotdate,
      slotTime,
      userdata,
      doctorData: doctorObj,
      amount: doctorData.fee,
      date: new Date()
    }

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    res.json({ success: true, message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
     console.log(error)
      res.status(500).json({ success: false, message: error.message });
  }
}



// API TO GET ALL APPOINTMENTS

const listAppointments = async (req, res) => {
  try {

    const userId = req.user
    const appointments = await appointmentModel.find({userId})

    res.json({ success: true, appointments });

    
    
  } catch (error) {
     console.log(error)
      res.status(500).json({ success: false, message: error.message });
  }

}

// API TO CANCEL APPOINTMENT 
const cancelAppointment = async (req, res) => {

  try {
    const {appointmentId} = req.body;
    const userId = req.user;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user
    if(appointmentData.userId !== userId){
      return res.json({ success: false, message: "You are not authorized to cancel this appointment" });
    
    }

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

    res.json({ success: true, message: "Appointment cancelled successfully" });
 
  } catch (error) {
    console.log(error)
      res.status(500).json({ success: false, message: error.message });
  }
}

export { registeruser, loginuser, getUserDetails,listAppointments, updateUser,bookAppointment ,cancelAppointment};