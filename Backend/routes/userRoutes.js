import express  from 'express';
import { bookAppointment, cancelAppointment, getUserDetails, listAppointments, loginuser, registeruser, updateUser } from '../Controllers/userController.js';
import upload from '../Middleware/multer.js';
import authUser from '../Middleware/authUser.js';




const userRouter = express.Router();

userRouter.post('/register', registeruser)
userRouter.post('/login', loginuser)
userRouter.get("/get-profile-details",authUser,getUserDetails )
userRouter.post("/update_profile",authUser,upload.single("image"),updateUser)
userRouter.post("/book-appointment",authUser,bookAppointment)
userRouter.get("/appointment",authUser,listAppointments)
userRouter.post("/cancel-appointment",authUser,cancelAppointment)



export {userRouter}