import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const My_Profile = () => {
  const { userdata: userData, setUserdata, token, backendUrl, loadUserData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(true)
  const [image, setImage] = useState(null)

  const updateProfile = async () => {
    const formData = new FormData()
    formData.append('name', userData.name)
    formData.append('email', userData.email)
    formData.append('phone', userData.phone)
    formData.append('address', JSON.stringify(userData.address))
    formData.append('gender', userData.gender)
    formData.append('DOB', userData.DOB)
    image && formData.append('image', image)

    try {
      const { data } = await axios.post(backendUrl + '/api/user/update_profile', formData, {
        headers: { token },
      })

      if (data.success) {
        setUserdata(data.user)
        toast.success(data.message)
        await loadUserData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  if (!userData) {
    return <div className='py-8 text-slate-500'>Loading profile...</div>
  }

  const profileImage = image ? URL.createObjectURL(image) : userData.image

  return (
    <div className='py-8'>
      <div className='grid gap-6 xl:grid-cols-[0.92fr_1.4fr]'>
        <div className='rounded-[32px] bg-gradient-to-br from-slate-950 via-sky-900 to-cyan-600 p-6 text-white shadow-xl'>
          <p className='text-xs uppercase tracking-[0.35em] text-cyan-100'>My Profile</p>
          <div className='mt-6 flex flex-col items-center text-center'>
            {isEdit ? (
              <label htmlFor='image' className='group relative cursor-pointer'>
                <img className='h-40 w-40 rounded-[28px] border border-white/20 object-cover shadow-lg' src={profileImage} alt='' />
                <div className='absolute inset-0 flex items-center justify-center rounded-[28px] bg-slate-900/45 text-sm font-medium opacity-0 transition group-hover:opacity-100'>
                  Change Photo
                </div>
                <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
              </label>
            ) : (
              <img className='h-40 w-40 rounded-[28px] border border-white/20 object-cover shadow-lg' src={profileImage} alt='' />
            )}

            <h1 className='mt-5 text-3xl font-semibold'>{userData.name}</h1>
            <p className='mt-2 text-cyan-100'>{userData.email}</p>
          </div>

          <div className='mt-8 grid gap-4'>
            <div className='rounded-3xl bg-white/10 p-4 backdrop-blur'>
              <p className='text-sm text-cyan-100'>Phone</p>
              <p className='mt-2 font-medium'>{userData.phone}</p>
            </div>
            <div className='rounded-3xl bg-white/10 p-4 backdrop-blur'>
              <p className='text-sm text-cyan-100'>Gender</p>
              <p className='mt-2 font-medium'>{userData.gender}</p>
            </div>
            <div className='rounded-3xl bg-white/10 p-4 backdrop-blur'>
              <p className='text-sm text-cyan-100'>Address</p>
              <p className='mt-2 font-medium'>{userData.address?.line1}</p>
              <p className='mt-1 text-sm text-cyan-100'>{userData.address?.line2}</p>
            </div>
          </div>
        </div>

        <div className='rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='text-2xl font-semibold text-slate-900'>Personal details</h2>
              <p className='text-sm text-slate-500'>Keep your patient profile accurate for smoother booking and follow-up.</p>
            </div>

            {isEdit ? (
              <button onClick={updateProfile} className='rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800'>
                Save Information
              </button>
            ) : (
              <button onClick={() => setIsEdit(true)} className='rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white'>
                Edit Profile
              </button>
            )}
          </div>

          <div className='mt-8 grid gap-5 md:grid-cols-2'>
            <label className='grid gap-2 text-sm text-slate-600'>
              Full Name
              {isEdit ? (
                <input
                  type='text'
                  onChange={(e) => setUserdata((prev) => ({ ...prev, name: e.target.value }))}
                  value={userData.name}
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary'
                />
              ) : (
                <div className='rounded-2xl bg-slate-50 px-4 py-3 text-slate-900'>{userData.name}</div>
              )}
            </label>

            <label className='grid gap-2 text-sm text-slate-600'>
              Email
              {isEdit ? (
                <input
                  type='text'
                  onChange={(e) => setUserdata((prev) => ({ ...prev, email: e.target.value }))}
                  value={userData.email || ''}
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary'
                />
              ) : (
                <div className='rounded-2xl bg-slate-50 px-4 py-3 text-slate-900'>{userData.email}</div>
              )}
            </label>

            <label className='grid gap-2 text-sm text-slate-600'>
              Phone Number
              {isEdit ? (
                <input
                  type='text'
                  onChange={(e) => setUserdata((prev) => ({ ...prev, phone: e.target.value }))}
                  value={userData.phone || ''}
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary'
                />
              ) : (
                <div className='rounded-2xl bg-slate-50 px-4 py-3 text-slate-900'>{userData.phone}</div>
              )}
            </label>

            <label className='grid gap-2 text-sm text-slate-600'>
              Gender
              {isEdit ? (
                <select
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary'
                  onChange={(e) => setUserdata((prev) => ({ ...prev, gender: e.target.value }))}
                  value={userData.gender || 'Male'}
                >
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </select>
              ) : (
                <div className='rounded-2xl bg-slate-50 px-4 py-3 text-slate-900'>{userData.gender}</div>
              )}
            </label>

            <label className='grid gap-2 text-sm text-slate-600 md:col-span-2'>
              Address Line 1
              {isEdit ? (
                <input
                  type='text'
                  onChange={(e) => setUserdata((prev) => ({ ...prev, address: { ...(prev.address || {}), line1: e.target.value } }))}
                  value={userData.address?.line1 || ''}
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary'
                />
              ) : (
                <div className='rounded-2xl bg-slate-50 px-4 py-3 text-slate-900'>{userData.address?.line1 || ''}</div>
              )}
            </label>

            <label className='grid gap-2 text-sm text-slate-600 md:col-span-2'>
              Address Line 2
              {isEdit ? (
                <input
                  type='text'
                  onChange={(e) => setUserdata((prev) => ({ ...prev, address: { ...(prev.address || {}), line2: e.target.value } }))}
                  value={userData.address?.line2 || ''}
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary'
                />
              ) : (
                <div className='rounded-2xl bg-slate-50 px-4 py-3 text-slate-900'>{userData.address?.line2 || ''}</div>
              )}
            </label>

            <label className='grid gap-2 text-sm text-slate-600 md:col-span-2'>
              Date of Birth
              {isEdit ? (
                <input
                  type='date'
                  onChange={(e) => setUserdata((prev) => ({ ...prev, DOB: e.target.value }))}
                  value={userData.DOB || ''}
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary'
                />
              ) : (
                <div className='rounded-2xl bg-slate-50 px-4 py-3 text-slate-900'>{userData.DOB}</div>
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default My_Profile
