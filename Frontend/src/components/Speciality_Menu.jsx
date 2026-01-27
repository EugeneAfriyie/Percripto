import React from 'react'
import { specialityData } from '../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'

const Speciality_Menu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='specialty'>
        <h1 className='text-3xl font-medium'>
            Find By Speciality
        </h1>
        <p className='sm:w-1/3 text-center text-sm'>
           Simply browse through our extensive list verified doctors and book your appointment in just a few clicks.  
        </p>
        <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
            {/* ------- Speciality Menu Items ------- */}

      {
            specialityData.map((item,index) =>(
                <div key={index} className="">
                    <Link onClick={() =>{  scrollTo(0,0)}} className='flex flex-col items-center text-xs cursor-pointer shrink-0 hover:translate-y-[-10px] transition-all duration-500' to={`/doctors/${item.speciality}`}>
                        <img className='w-16 sm:w-24 mb-2 ' src={item.image}  alt="" />
                        <p>{item.speciality}</p>
                    </Link>
                </div>
            ))
        }

        </div>
    </div>
  )
}

export default Speciality_Menu