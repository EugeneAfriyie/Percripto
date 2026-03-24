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


    const getDocList = async () => {
        try {
            console.log('Fetching doctors from:', backendUrl + `/api/doctor/list`);
            const { data } = await axios.get( backendUrl + `/api/doctor/list` );
            // toast.success(data.message);

            if (data.success) {
                setDoctors(data.doctors);
                console.log("Doctors loaded:", data.doctors)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };

    useEffect(() =>{
        getDocList()
    },[])


    const value = {
        doctors,currencySymbol,token,setToken,backendUrl
    }

    return (
    <AppContext.Provider value={value}>
        {props.children} 
    
    </AppContext.Provider>
    )
}; 


export default AppContextProvider;