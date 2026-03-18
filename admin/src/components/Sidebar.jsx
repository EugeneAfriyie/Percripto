import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const { adminToken, setAdminToken  } = useContext(AdminContext)
  return (
    <div className='min-h-screen bg-white border-r'>
        {
            adminToken && <ul className='text-[#515151] mt-5'>
            
                <NavLink className={``} to={'/admin_dashboard'}>
                    <img src={assets.home_icon} alt="" />
                    <p>Dashboard</p>
                </NavLink>

                <NavLink to={'/all-appointment'}>
                    <img src={assets.appointment_icon} alt="" />
                    <p>Appointments</p>
                </NavLink>

                <NavLink to={'/add_doctor'}>
                    <img src={assets.add_icon} alt="" />
                    <p>Add Doctor</p>
                </NavLink>

                <NavLink to={'/doc_list'}>
                    <img src={assets.people_icon} alt="" />
                    <p>Doctors</p>
                </NavLink>

            </ul>
            

 

        }
    </div>
  )
}

export default Sidebar