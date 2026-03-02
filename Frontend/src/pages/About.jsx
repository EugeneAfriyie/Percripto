import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const About = () => {
  return (
    <div>

      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className='text-gray-700'>US</span>
        </p>
      </div>


      <div className="my-10 flex flex-col md:flex-row gap-10">
        <img className='w-full md:max-w-[350px] ' src={assets.about_image} alt="" />

        <div className=" flex flex-col gap-6 md:w-2/4  text-gray-600">
          <p>welcome Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque corporis debitis dolores necessitatibus reiciendis. Aut at ratione magni natus labore?</p>
          <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Recusandae nesciunt voluptatibus similique blanditiis laudantium at, voluptatum cupiditate excepturi non dignissimos.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat distinctio soluta, aut aperiam cumque deleniti architecto at repellat non ullam minima commodi veniam excepturi? Ipsum tempora ducimus nihil asperiores recusandae.</p>
        </div>
      </div>


      <div className="text-xl my-4">
        <p >WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg px-10 md:px-16 py-6 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 cursor-pointer">
          <b className=' '>Fast Delivery</b>
          <p className=' '>We deliver your products quickly and efficiently.</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg px-10 md:px-16 py-6 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 cursor-pointer">
          <b className='text-gray-800'>Quality Products</b>
          <p className='text-gray-600'>We ensure all our products are of the highest quality.</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg px-10 md:px-16 py-6 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 cursor-pointer">
          <b className='text-gray-800'>Customer Support</b>
          <p className='text-gray-600'>Our support team is always ready to assist you.</p>
        </div>


       
      </div>
        
    </div>
  )
}

export default About