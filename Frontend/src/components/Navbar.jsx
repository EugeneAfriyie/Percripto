import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const { token, setToken, userdata } = useContext(AppContext)

  const loginOut = () => {
    setToken(false)
    localStorage.removeItem('token')
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'All Doctors' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <div className='sticky top-0 z-30 mb-6 border-b border-slate-200 bg-white/90 py-4 backdrop-blur'>
      <div className='flex justify-between items-center gap-4 text-sm'>
        <img onClick={() => navigate('/')} src={assets.logo} alt='logo' className='w-40 sm:w-44 cursor-pointer' />

        <ul className='hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-600'>
          {navLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-full px-4 py-2 transition ${isActive ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}>
              {item.label}
            </NavLink>
          ))}
        </ul>

        <div className='flex items-center gap-4'>
          {token && userdata ? (
            <div className='group relative flex items-center gap-3 cursor-pointer'>
              <div className='hidden md:block text-right'>
                <p className='text-xs uppercase tracking-[0.25em] text-slate-400'>Logged In</p>
                <p className='text-sm font-medium text-slate-700'>{userdata.name}</p>
              </div>
              <img className='h-10 w-10 rounded-full border border-slate-200 object-cover' src={userdata?.image} alt='' />
              <img className='w-2.5' src={assets.dropdown_icon} alt='' />

              <div className='absolute right-0 top-0 hidden pt-14 group-hover:block'>
                <div className='min-w-52 rounded-2xl border border-slate-200 bg-white p-3 text-base font-medium text-slate-500 shadow-xl'>
                  <p onClick={() => navigate('/my_profile')} className='rounded-xl px-3 py-2 hover:bg-slate-50 hover:text-slate-900'>My Profile</p>
                  <p onClick={() => navigate('/my_appointment')} className='rounded-xl px-3 py-2 hover:bg-slate-50 hover:text-slate-900'>My Appointment</p>
                  <p onClick={loginOut} className='rounded-xl px-3 py-2 hover:bg-slate-50 hover:text-slate-900'>Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className='hidden md:block rounded-full bg-slate-900 px-7 py-3 font-medium text-white transition hover:bg-slate-800'>
              Create Account
            </button>
          )}

          <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt='' />

          <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
            <div className='flex items-center justify-between border-b border-slate-200 px-5 py-6'>
              <img className='w-36' src={assets.logo} alt='' />
              <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt='' />
            </div>
            <div className='px-5 py-6'>
              <ul className='flex flex-col gap-2 text-lg font-medium text-slate-700'>
                {navLinks.map((item) => (
                  <NavLink key={item.to} onClick={() => setShowMenu(false)} to={item.to}>
                    <p className='rounded-2xl px-4 py-3 hover:bg-slate-50'>{item.label}</p>
                  </NavLink>
                ))}
                {!token && (
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      navigate('/login')
                    }}
                    className='mt-2 rounded-2xl bg-slate-900 px-4 py-3 text-left text-white'
                  >
                    Create Account
                  </button>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
