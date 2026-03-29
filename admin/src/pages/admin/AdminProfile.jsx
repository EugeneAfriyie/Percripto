import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets_admin/assets'

const AdminProfile = () => {
  const { adminProfile, getAdminProfile, updateAdminProfile, adminToken } = useContext(AdminContext)
  const [name, setName] = useState('')
  const [image, setImage] = useState(false)

  useEffect(() => {
    if (adminToken) {
      getAdminProfile()
    }
  }, [adminToken])

  useEffect(() => {
    if (adminProfile) {
      setName(adminProfile.name || 'Admin')
    }
  }, [adminProfile])

  const onSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('name', name)

    if (image) {
      formData.append('image', image)
    }

    await updateAdminProfile(formData)
    setImage(false)
  }

  if (!adminProfile) {
    return <div className='w-full p-6 text-gray-500'>Loading admin profile...</div>
  }

  const previewImage = image ? URL.createObjectURL(image) : adminProfile.image || assets.upload_area

  return (
    <form onSubmit={onSubmit} className='w-full p-4 sm:p-6 lg:p-8'>
      <div className='grid gap-6 xl:grid-cols-[0.9fr_1.4fr]'>
        <div className='rounded-[30px] bg-gradient-to-br from-slate-900 via-indigo-800 to-blue-600 p-6 text-white shadow-xl'>
          <p className='text-xs uppercase tracking-[0.35em] text-blue-100'>Admin Profile</p>
          <h1 className='mt-4 text-3xl font-semibold'>{adminProfile.name || 'Admin'}</h1>
          <p className='mt-2 text-blue-100'>{adminProfile.email}</p>

          <div className='mt-8 rounded-3xl bg-white/10 p-4 backdrop-blur'>
            <p className='text-sm text-blue-100'>Account Photo</p>
            <div className='mt-4 flex justify-center'>
              <img
                className='h-36 w-36 rounded-3xl border border-white/20 object-cover bg-white/10'
                src={previewImage}
                alt='Admin profile'
              />
            </div>
          </div>
        </div>

        <div className='rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl font-semibold text-slate-900'>Update Profile</h2>
              <p className='text-sm text-slate-500'>Add or replace the admin profile photo and display name.</p>
            </div>
            <button type='submit' className='rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white'>
              Save Changes
            </button>
          </div>

          <div className='mt-8 grid gap-6'>
            <div className='flex items-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4'>
              <label htmlFor='admin-image' className='cursor-pointer'>
                <img
                  className='h-20 w-20 rounded-2xl object-cover bg-white'
                  src={previewImage}
                  alt='Admin upload'
                />
              </label>
              <div>
                <p className='font-medium text-slate-900'>Upload profile photo</p>
                <p className='mt-1 text-sm text-slate-500'>Click the image to choose a new photo.</p>
              </div>
              <input
                id='admin-image'
                type='file'
                accept='image/*'
                hidden
                onChange={(event) => setImage(event.target.files[0])}
              />
            </div>

            <label className='grid gap-2 text-sm text-slate-600'>
              Display Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className='rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary'
                placeholder='Admin'
              />
            </label>

            <div className='rounded-3xl bg-slate-50 p-4'>
              <p className='text-sm text-slate-500'>Account Email</p>
              <p className='mt-1 font-medium text-slate-900'>{adminProfile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AdminProfile
