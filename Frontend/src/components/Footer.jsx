import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='mx-10'>
        <div className="flex flex-col sm:grid sm:grid-cols-3 my-10 mt-40 text-sm  gap-14 ">
            {/* Left section */}
            <div className="">
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit laboriosam consequuntur omnis reprehenderit ipsam aperiam ut placeat iure deserunt ipsum!
                </p>
            </div>

            {/* Middle section */}
            <div className="">
                <p className='text-xl font-medium mb-5 '>Company</p>
                <ul className='flex flex-col gap-2 text-gray-500 '>
                    <li>About Us</li>
                    <li>Careers</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy  </li>
                </ul>
            </div>

            {/* Right section */}
            <div className="">
                <p className='text-xl font-medium mb-5'>Get in Touch</p>
                <ul className='flex flex-col gap-2 text-gray-500 '>
                    <li>+233 123 456 789</li>
                    <li>groupeight00@gmail.com</li>
                </ul>
            </div>
        </div>

        <div className="footer-bottom">
            <hr />
            <p className='py-5 text-sm text-center  '>&copy; 2024 Percripto. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer