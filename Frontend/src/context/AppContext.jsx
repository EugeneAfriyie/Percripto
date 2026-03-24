import { createContext, useEffect, useState } from "react";
import {   toast } from 'react-toastify';
import axios from "axios";


export const AppContext = createContext()
const currencySymbol = '$';


const AppContextProvider = (props) => {

    const [doctors, setDoctors] = useState([]);
    // Fallback to localhost:5000 if the .env variable is missing
    const backendUrl = import.meta.env.VITE_BACKEND_URL ;
    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : false);
    const [userdata,setUserdata] = useState(false)


    const getDocList = async () => {
        try {
            console.log('Fetching doctors from:', backendUrl + `/api/doctor/list`);
            const { data } = await axios.get( backendUrl + `/api/doctor/list` );
            // toast.success(data.message);

            if (data.success) {
                setDoctors(data.doctors);
                console.log("Doctors loaded:", data.doctors)
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };

    const UndateUserData = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + `try {
            const { data } = await axios.post(
                backendUrl + `/api/admin/all-doctors`,
                {},
                {
                    headers: { token: adminToken }
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
        }s`,
                {},
                {
                    headers: { token }
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
    }

const loadUserData = async () => {
  try {
    const { data } = await axios.get(
      `${backendUrl}/api/user/get-profile-details`,
      { headers: { token } }
    );

    if (data.success) {
      setUserdata(data.user);
      console.log("Loaded user:", data.user); // log here
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
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
        doctors,currencySymbol,token,setToken,backendUrl,setUserdata,userdata,loadUserData
    }

    return (
    <AppContext.Provider value={value}>
        {props.children} 
    
    </AppContext.Provider>
    )
}; 


export default AppContextProvider;