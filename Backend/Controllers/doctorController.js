import doctorModel from "../model/doctorModel.js";
import appointmentModel from "../model/appointmentModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

const sanitizeDoctor = (doctor) => {
  const doctorObject = doctor.toObject ? doctor.toObject() : { ...doctor };
  delete doctorObject.password;
  return doctorObject;
};

const releaseDoctorSlot = async (docId, slotdate, slotTime) => {
  const doctorData = await doctorModel.findById(docId);

  if (!doctorData) {
    return;
  }

  const slotBooked = doctorData.slots_booked || {};

  if (slotBooked[slotdate]) {
    slotBooked[slotdate] = slotBooked[slotdate].filter((time) => time !== slotTime);

    if (slotBooked[slotdate].length === 0) {
      delete slotBooked[slotdate];
    }
  }

  await doctorModel.findByIdAndUpdate(
    docId,
    { slots_booked: slotBooked },
    { returnDocument: "after" }
  );
};

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const updatedDoc = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }
    );

    res.json({
      success: true,
      message: `Availability Changed to ${updatedDoc.available}`,
      doctor: sanitizeDoctor(updatedDoc),
    });
  } catch (error) {
    console.log("Error updating doctor availability:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.json({
      success: true,
      doctors,
      message: "Doctors List Fetched Successfully",
    });
  } catch (error) {
    console.log("Error fetching doctor list:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      success: true,
      message: "Doctor logged in successfully",
      token,
      doctor: sanitizeDoctor(doctor),
    });
  } catch (error) {
    console.log("Error logging in doctor:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.doctorId).select("-password");

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    return res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.log("Error getting doctor profile:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    let { name, speciality, degree, experience, about, fee, address, available } = req.body;
    const imagefile = req.file;

    const updateData = {};

    if (name) updateData.name = name;
    if (speciality) updateData.speciality = speciality;
    if (degree) updateData.degree = degree;
    if (experience) updateData.experience = experience;
    if (about) updateData.about = about;
    if (fee !== undefined) updateData.fee = Number(fee);
    if (available !== undefined) updateData.available = available === "true" || available === true;

    if (address) {
      updateData.address = typeof address === "string" ? JSON.parse(address) : address;
    }

    if (imagefile) {
      const uploadimg = await cloudinary.uploader.upload(imagefile.path, {
        resource_type: "image",
      });

      updateData.image = uploadimg.secure_url;
    }

    const updatedDoctor = await doctorModel
      .findByIdAndUpdate(doctorId, updateData, { new: true })
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.log("Error updating doctor profile:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.doctorId }).sort({ date: -1 });
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.log("Error fetching doctor appointments:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const completeDoctorAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.docId !== req.doctorId) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: "Cancelled appointments cannot be completed" });
    }

    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { isCompleted: true },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Appointment marked as completed" });
  } catch (error) {
    console.log("Error completing doctor appointment:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const cancelDoctorAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.docId !== req.doctorId) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { cancelled: true, isCompleted: false },
      { new: true }
    );

    await releaseDoctorSlot(appointment.docId, appointment.slotdate, appointment.slotTime);

    return res.status(200).json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log("Error cancelling doctor appointment:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.doctorId }).sort({ date: -1 });
    const patients = new Set(appointments.map((appointment) => appointment.userId));

    const dashData = {
      earnings: appointments
        .filter((appointment) => appointment.payment && appointment.isCompleted && !appointment.cancelled)
        .reduce((total, appointment) => total + appointment.amount, 0),
      appointments: appointments.length,
      patients: patients.size,
      latestAppointments: appointments.slice(0, 5),
    };

    return res.status(200).json({ success: true, dashData });
  } catch (error) {
    console.log("Error loading doctor dashboard:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export {
  changeAvailability,
  doctorList,
  doctorLogin,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  completeDoctorAppointment,
  cancelDoctorAppointment,
  doctorDashboard,
};
