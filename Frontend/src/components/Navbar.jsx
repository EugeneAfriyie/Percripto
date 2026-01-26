import React from 'react'
import {assets}  from '../assets/assets_frontend/assets'
import { NavLink } from 'react-router-dom'


const Navbar = () => {
  return (
    <div className='flex justify-between items-center text-sm mb-5 border-b-gray-400 border-b py-4'>
        <img src={assets.logo} alt="logo" className='w-44 cursor-pointer' />
        <ul className='hidden md:flex  items-start gap-5  font-medium'>
            <NavLink to='/'>
                <li className='py-1'>Home</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/doctors'>
                <li className='py-1'>All Doctors</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/about'>
                <li className='py-1'>About</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/contact'>
                <li className='py-1'>Contact</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
        </ul>
        <div className="">
            <button>Create Account</button>
        </div>
    </div>
  )
}

export default Navbar 