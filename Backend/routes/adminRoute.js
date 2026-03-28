import express  from 'express';
import upload from '../Middleware/multer.js';
import { addDoctor, adminListAppointments, adminLogin, allDoctors, cancelAppointment } from '../Controllers/adminController.js';
import authAdminMiddleware from '../Middleware/authAdminMiddleware.js';
import { changeAvailability } from '../Controllers/doctorController.js';




const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdminMiddleware, upload.single('image'), addDoctor)
adminRouter.post('/login', adminLogin)
adminRouter.post('/all-doctors',authAdminMiddleware, allDoctors)
adminRouter.post('/change-avalability',authAdminMiddleware, changeAvailability)
adminRouter.get("/get-all-appointments", authAdminMiddleware, adminListAppointments)
adminRouter.post("/cancel-appointment", authAdminMiddleware, cancelAppointment)
adminRouter.get("/dashboard", authAdminMiddleware, dashboardData) 

export {adminRouter}