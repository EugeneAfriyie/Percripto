import React from 'react'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my_profile' element={<My_Profile />} />
        <Route path='/my_appointment' element={<My_Appointment />} />
        <Route path='*' element={<Error />} />
      </Routes>
    
    </div>
  )
}

export default App