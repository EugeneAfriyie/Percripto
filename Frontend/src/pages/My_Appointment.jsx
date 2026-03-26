import React, { useContext } from 'react'
import  { AppContext } from '../context/AppContext'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const My_Appointment = () => {

  const {backendUrl,token} = useContext(AppContext)
  const [appointment,setAppointment] = useState([])
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const slotDateFormat = (slotdate) =>{
    const dataArray = slotdate.split('-')
    const day = dataArray[0]
    const month = dataArray[1]
    const year = dataArray[2]

    return day + ' ' + months[Number(month - 1) ] + ' ' + year
  }

  const getAppointment = async() =>{
    try {
      const {data} = await axios.get(backendUrl + '/api/user/appointment',{headers: {token}})
      if(data.success){
        setAppointment(data.appointments.reverse())
        console.log(data.appointments)
        
       
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async(appointmentId) =>{
    console.log(appointmentId)
    try {
      const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers: {token}})
      if(data.success){
        toast.success(data.message)
        getAppointment()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() =>{
    getAppointment()
  },[token])

  useEffect(() =>{
    if(token){
      getAppointment()
       
    }
  },[token])


  const {doctors} = useContext(AppContext)
  // console.log(doctors)
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div className="">
      {
        appointment.map((item,index) =>(
          <div  className=" grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b " key={index}>
            <div className="">
              <img className='w-32 bg-indigo-50' src={item.doctorData.image} alt="" />
            </div>

          <div className="flex-1 text-sm text-zinc-600">
            <p className='text-neutral-800 font-semibold'>{item.doctorData.name}</p>
            <p>{item.doctorData.speciality}</p>
            <p className='text-zinc-700 font-medium mt-1'>Address:</p>
            <p className='text-xs'>{item.doctorData.address.line1}</p>
            <p className='text-xs'>{item.doctorData.address.line2}</p>
            <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time </span> {slotDateFormat(item.slotdate)} | {item.slotTime}</p>
          </div>
          <div className=""></div>
          <div className="flex flex-col gap-2 justify-end">
            

            { !item.cancelled && <button className='text-sm text-stone-500 text-center sm:min-w-48 border hover:bg-primary hover:text-white transition-all duration-300 py-2'>Pay online</button>

            }
            { !item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 border hover:bg-red-600 hover:text-white transition-all duration-300 py-2'>Cancel Appointment</button>
            }

            { item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>
}

          </div>


          </div>
        ))
      }
      </div>
    </div>
  )
}

export default My_Appointment