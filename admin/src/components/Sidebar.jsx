import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
  const { adminToken } = useContext(AdminContext)
  const { doctorToken } = useContext(DoctorContext)

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 py-3.5 px-3 md:px-9 min-w-56 lg:min-w-72 cursor-pointer ${
      isActive ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary' : ''
    }`

  return (
    <div className='min-h-screen bg-white border-r'>
      {adminToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink className={navClass} to='/admin/dashboard'>
            <img src={assets.home_icon} alt='' />
            <p>Dashboard</p>
          </NavLink>

          <NavLink className={navClass} to='/admin/appointments'>
            <img src={assets.appointment_icon} alt='' />
            <p>Appointments</p>
          </NavLink>

          <NavLink className={navClass} to='/admin/add-doctor'>
            <img src={assets.add_icon} alt='' />
            <p>Add Doctor</p>
          </NavLink>

          <NavLink className={navClass} to='/admin/doctors'>
            <img src={assets.people_icon} alt='' />
            <p>Doctors</p>
          </NavLink>

          <NavLink className={navClass} to='/admin/profile'>
            <img src={assets.doctor_icon} alt='' />
            <p>Profile</p>
          </NavLink>
        </ul>
      )}

      {doctorToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink className={navClass} to='/doctor/dashboard'>
            <img src={assets.home_icon} alt='' />
            <p>Overview</p>
          </NavLink>

          <NavLink className={navClass} to='/doctor/appointments'>
            <img src={assets.appointment_icon} alt='' />
            <p>Appointments</p>
          </NavLink>

          <NavLink className={navClass} to='/doctor/profile'>
            <img src={assets.doctor_icon} alt='' />
            <p>My Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar
