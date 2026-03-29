import { createContext, useEffect, useState } from "react";
import {   toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const AppContext = createContext()
const currencySymbol = '$';


const AppContextProvider = (props) => {

    const [doctors, setDoctors] = useState([]);
    // Fallback to localhost:5000 if the .env variable is missing
    const backendUrl = import.meta.env.VITE_BACKEND_URL ;
    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : false);
    const [userdata,setUserdata] = useState(false)
    const [doctorsLoading, setDoctorsLoading] = useState(false)
    const [userLoading, setUserLoading] = useState(false)




    const getDocList = async () => {
        try {
            setDoctorsLoading(true)
            // console.log('Fetching doctors from:', backendUrl + `/api/doctor/list`);
            const { data } = await axios.get( backendUrl + `/api/doctor/list` );
            // toast.success(data.message);

            if (data.success) {
                setDoctors(data.doctors);
                // console.log("Doctors loaded:", data)
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message);
        } finally {
            setDoctorsLoading(false)
        }
    };

    const loadUserData = async () => {
    try {
        setUserLoading(true)
        const { data } = await axios.get(
        `${backendUrl}/api/user/get-profile-details`,
        { headers: { token } }
        );

        if (data.success) {
        setUserdata(data.user);
        //   console.log("Loaded user:", data.user); // log here
        } else {
        toast.error(data.message);
        }
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || error.message);
        // Automatically log out if the backend rejects the token
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            setToken(false);
            setUserdata(false);
        }
    } finally {
        setUserLoading(false)
    }
    };

    useEffect(() =>{
        getDocList()
    },[])

   useEffect(() => {
  if (token) {
    const fetchUser = async () => {
      await loadUserData();
    //   console.log("User data loaded inside async function" ,userdata);
    };
    fetchUser();
  } else {
    setUserdata(null);
  }
}, [token]);





    const value = {
        doctors,currencySymbol,token,setToken,backendUrl,setUserdata,userdata,loadUserData,getDocList,doctorsLoading,userLoading
    }

    return (
    <AppContext.Provider value={value}>
        {props.children} 
    
    </AppContext.Provider>
    )
}; 


export default AppContextProvider;
