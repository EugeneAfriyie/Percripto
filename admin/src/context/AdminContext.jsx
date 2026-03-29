import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdmincontextProvider = (props) => {

    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(null);
    const [adminProfile, setAdminProfile] = useState(null);








    const backendUrl = import.meta.env.VITE_BACKEND_URL;

     const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    
       const slotDateFormat = (slotdate) =>{
        const dataArray = slotdate.split('-')
        const day = dataArray[0]
        const month = dataArray[1]
        const year = dataArray[2]
        
        return day + ' ' + months[Number(month - 1) ] + ' ' + year
      }

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + `/api/admin/all-doctors`,
                {},
                {
                    headers: { adminToken }
                }
            );

            if (data.success) {
                setDoctors(data.doctors);
                // console.log(data.doctors)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };


    const changeAvailability = async (docId) =>{
        try {
            const { data } = await axios.post(
                backendUrl + `/api/admin/change-avalability`,
                {docId},
                {
                    headers: { adminToken }
                }
            );

            if (data.success){
                toast.success(data.message)
                getAllDoctors()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
              toast.error(error.message);
        }
    }

    const getAllAppointments = async () =>{
        try {
            const {data} = await axios.get(
                backendUrl + `/api/admin/get-all-appointments`,
                {
                    headers: { adminToken }
                }
            );

            if (data.success){
                setAppointments(data.appointments)
                // console.log(data.appointments)
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + `/api/admin/dashboard`,
                {
                    headers: { adminToken }
                }
            );

            if (data.success) {
                setDashData(data.dashData);
                console.log(data.dashData)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAdminProfile = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + `/api/admin/profile`,
                {
                    headers: { adminToken }
                }
            )

            if (data.success) {
                setAdminProfile(data.admin)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const updateAdminProfile = async (formData) => {
        try {
            const { data } = await axios.post(
                backendUrl + `/api/admin/update-profile`,
                formData,
                {
                    headers: { adminToken }
                }
            )

            if (data.success) {
                setAdminProfile(data.admin)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

     const cancelAppointment = async(appointmentId) =>{
        console.log(appointmentId)
        try {
          const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment',{appointmentId},{headers: {adminToken}})
          if(data.success){
            toast.success(data.message)
            getAllAppointments()
          }else{
            toast.error(data.message)
          }
          
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }

        

     

    const value = {
        adminToken,
        setAdminToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        getAllAppointments,
        appointments,
        setAppointments,
        getDashData,
        dashData,
        cancelAppointment,
        adminProfile,
        getAdminProfile,
        updateAdminProfile
       
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdmincontextProvider;
