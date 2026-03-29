import express  from 'express';
import upload from '../Middleware/multer.js';
import authDoctor from '../Middleware/authDoctor.js';
import {
  cancelDoctorAppointment,
  completeDoctorAppointment,
  doctorDashboard,
  doctorList,
  doctorLogin,
  getDoctorAppointments,
  getDoctorProfile,
  updateDoctorProfile,
} from '../Controllers/doctorController.js';


const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', doctorLogin)
doctorRouter.get('/profile', authDoctor, getDoctorProfile)
doctorRouter.post('/update-profile', authDoctor, upload.single('image'), updateDoctorProfile)
doctorRouter.get('/appointments', authDoctor, getDoctorAppointments)
doctorRouter.post('/complete-appointment', authDoctor, completeDoctorAppointment)
doctorRouter.post('/cancel-appointment', authDoctor, cancelDoctorAppointment)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)



export {doctorRouter}
