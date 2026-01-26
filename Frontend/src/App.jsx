import React from 'react'
import { Routes, Route } from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Doctors from './pages/Doctors'
import My_Profile from './pages/My_Profile'
import My_Appointment from './pages/My_Appointment'
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my_profile' element={<My_Profile />} />
        <Route path='/my_appointment' element={<My_Appointment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='*' element={<Error />} />
      </Routes>
    
    </div>
  )
}

export default App