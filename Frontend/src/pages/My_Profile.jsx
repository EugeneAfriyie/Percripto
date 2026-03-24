import React from 'react'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'
import { useEffect } from 'react'

const My_Profile = () => {

  const {userdata: userData, setUserdata} = useContext(AppContext)
  
  
  const [isEdit, setIsEdit] = React.useState(true) 
  
  
  // if (!userData) return <p>Loading profile...</p>;
 useEffect(() => {
  console.log("UserData changed:", userData);
}, [userData]);
  return (
    userData && (
      <div className='max-w-lg flex flex-col gap-2 text-sm'>
      <img className=' w-36 rounded' src={userData.image} alt="" />

      {isEdit ? <input type="text" onChange={e => setUserdata(prev => ({...prev,name: e.target.value}))} value={userData.name} className=' bg-gray-50 text-3xl font-medium max-w-60 mt-4'  /> : <p className='font-medium text-3xl text-neutral-800 mt-4 '>{userData.name}</p>}
      <hr className='bg-zinc-400 border-none' />

      <div className="">
        <p className='text-neutral-500 underline mt-3'>Contact Information</p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 ">
          <p className='font-medium'>Email id</p>
          {isEdit ? <input type="text" onChange={e => setUserdata(prev => ({...prev,email: e.target.value}))} value={userData.email || ''} className='border'  /> : <p className='text-blue-500'>{userData.email}</p>}

          <p className='font-medium'>Phone Number</p>
          {isEdit ? <input type="text" onChange={e => setUserdata(prev => ({...prev,phone: e.target.value}))} value={userData.phone || ''} className='border bg-gray-100'  /> : <p className='text-blue-400'>{userData.phone}</p>}

          <p className='font-medium'>Address:</p>
          {

          isEdit
           ? 
           
           
           <p>
            <input type="text" onChange={e => setUserdata(prev => ({...prev,address: {...(prev.address || {}), line1: e.target.value}}))} value={userData.address?.line1 || ''} className='border bg-gray-50'  /> 
  
            <br />
  
            <input type="text" onChange={e => setUserdata(prev => ({...prev,address: {...(prev.address || {}), line2: e.target.value}}))} value={userData.address?.line2 || ''} className='border bg-gray-50'  /> 

          </p>
          : 
          <p className='text-gray-500'>{userData.address?.line1 || ''}
          <br />

       {userData.address?.line2 || ''}
          </p>
          
          }

      

        </div>
      </div>

      <div className="">
        <p className='text-neutral-500 underline mt-3'>Basic Information</p>
        <div className=" grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 ">
          <p className='font-medium'>Gender: </p>
          {
          isEdit
           ? 
          <select className='max-w-20 bg-gray-100' name="gender" id="gender" onChange={e => setUserdata(prev => ({...prev,gender: e.target.value}))} value={userData.gender || 'Male'}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
           : 
           <p className='text-gray-400'>{userData.gender}</p>}



           <p className='font-medium'>Date of Birth: </p>
           {isEdit ? <input type="date" onChange={e => setUserdata(prev => ({...prev,DOB: e.target.value}))} value={userData.DOB || ''} className='border bg-gray-100'  /> : <p className='text-gray-400'>{userData.DOB}</p>}
        </div>
      </div>


      <div className=" mt-10">
        {isEdit ? 
        <button onClick={() => setIsEdit(false)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Save Infomation</button>
        :
        <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Edit</button>
        }
      </div>




    </div>
    )
  )
}

export default My_Profile