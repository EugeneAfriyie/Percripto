import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorcontextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [doctorToken, setDoctorToken] = useState(localStorage.getItem("doctorToken") || "");
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [doctorDashData, setDoctorDashData] = useState(null);
  const [doctorProfileLoading, setDoctorProfileLoading] = useState(false);
  const [doctorAppointmentsLoading, setDoctorAppointmentsLoading] = useState(false);
  const [doctorDashLoading, setDoctorDashLoading] = useState(false);
  const [doctorProfileSaving, setDoctorProfileSaving] = useState(false);

  const getDoctorProfile = async () => {
    try {
      setDoctorProfileLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { doctortoken: doctorToken },
      });

      if (data.success) {
        setDoctorProfile(data.doctor);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDoctorProfileLoading(false);
    }
  };

  const getDoctorAppointments = async () => {
    try {
      setDoctorAppointmentsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { doctortoken: doctorToken },
      });

      if (data.success) {
        setDoctorAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDoctorAppointmentsLoading(false);
    }
  };

  const getDoctorDashboard = async () => {
    try {
      setDoctorDashLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { doctortoken: doctorToken },
      });

      if (data.success) {
        setDoctorDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDoctorDashLoading(false);
    }
  };

  const refreshDoctorData = async () => {
    if (!doctorToken) {
      return;
    }

    await Promise.all([
      getDoctorProfile(),
      getDoctorAppointments(),
      getDoctorDashboard(),
    ]);
  };

  const updateDoctorProfile = async (profileData) => {
    try {
      setDoctorProfileSaving(true);
      const payload = new FormData();
      payload.append("name", profileData.name);
      payload.append("speciality", profileData.speciality);
      payload.append("experience", profileData.experience);
      payload.append("fee", profileData.fee);
      payload.append("degree", profileData.degree);
      payload.append("about", profileData.about);
      payload.append("available", profileData.available);
      payload.append("address", JSON.stringify(profileData.address));

      if (profileData.image) {
        payload.append("image", profileData.image);
      }

      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, payload, {
        headers: { doctortoken: doctorToken },
      });

      if (data.success) {
        setDoctorProfile(data.doctor);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDoctorProfileSaving(false);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { doctortoken: doctorToken } }
      );

      if (data.success) {
        toast.success(data.message);
        refreshDoctorData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { doctortoken: doctorToken } }
      );

      if (data.success) {
        toast.success(data.message);
        refreshDoctorData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const value = {
    doctorToken,
    setDoctorToken,
    backendUrl,
    doctorProfile,
    doctorAppointments,
    doctorDashData,
    getDoctorProfile,
    getDoctorAppointments,
    getDoctorDashboard,
    refreshDoctorData,
    updateDoctorProfile,
    completeAppointment,
    cancelAppointment,
    doctorProfileLoading,
    doctorAppointmentsLoading,
    doctorDashLoading,
    doctorProfileSaving,
  };

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorcontextProvider;
