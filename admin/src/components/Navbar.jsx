import React, {  useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { adminToken, setAdminToken  } = useContext(AdminContext)

  const navigate = useNavigate()
  const logOut = () =>{
    adminToken && setAdminToken(null)
    adminToken && localStorage.removeItem('adminToken') 
    navigate('/')
  }
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex text-xs items-center gap-2">
        <img className='w-16 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{adminToken ? 'Admin' : 'Doctor'}</p>
      </div>
       <button onClick={logOut} className='bg-primary text-white text-sm px-10 py-2 rounded-full '>Logout</button>
    </div>
  )
}

export default Navbar