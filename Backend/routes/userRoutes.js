import express  from 'express';
import { getUserDetails, loginuser, registeruser, updateUser } from '../Controllers/userController.js';
import upload from '../Middleware/multer.js';
import authUser from '../Middleware/authUser.js';




const userRouter = express.Router();

userRouter.post('/register', registeruser)
userRouter.post('/login', loginuser)
userRouter.get("/get-profile-details",authUser,getUserDetails )
userRouter.post("/update_profile",authUser,upload.single("image"),updateUser)

export {userRouter}