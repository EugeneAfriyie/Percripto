import { createContext, useState } from "react"



export const AdminContext = createContext()

const AdmincontextProvider = (props) => {

    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const value ={
        adminToken,setAdminToken,backendUrl
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}


export default AdmincontextProvider