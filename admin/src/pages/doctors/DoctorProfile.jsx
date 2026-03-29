import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorProfile = () => {
  const { doctorProfile, updateDoctorProfile, getDoctorProfile, doctorToken } = useContext(DoctorContext)
  const [formData, setFormData] = useState(null)
  const [image, setImage] = useState(false)

  useEffect(() => {
    if (doctorToken) {
      getDoctorProfile()
    }
  }, [doctorToken])

  useEffect(() => {
    if (doctorProfile) {
      setFormData({
        name: doctorProfile.name || '',
        speciality: doctorProfile.speciality || '',
        experience: doctorProfile.experience || '',
        fee: doctorProfile.fee || '',
        degree: doctorProfile.degree || '',
        about: doctorProfile.about || '',
        available: doctorProfile.available || false,
        address: {
          line1: doctorProfile.address?.line1 || '',
          line2: doctorProfile.address?.line2 || '',
        },
      })
    }
  }, [doctorProfile])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleAddressChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateDoctorProfile({
      ...formData,
      fee: Number(formData.fee),
      image,
    })
  }

  if (!doctorProfile || !formData) {
    return <div className='w-full p-6 text-gray-500'>Loading doctor profile...</div>
  }

  const profileAddress = [doctorProfile.address?.line1, doctorProfile.address?.line2]
    .filter(Boolean)
    .join(', ')

  const previewImage = image ? URL.createObjectURL(image) : doctorProfile.image || assets.upload_area

  return (
    <div className='w-full p-4 sm:p-6 lg:p-8'>
      <div className='grid gap-6 xl:grid-cols-[0.95fr_1.4fr]'>
        <div className='rounded-[32px] bg-gradient-to-br from-teal-600 via-cyan-700 to-slate-900 p-6 text-white shadow-xl'>
          <p className='text-xs uppercase tracking-[0.35em] text-cyan-100'>Doctor Profile</p>
          <div className='mt-6 flex flex-col items-center text-center'>
            <label htmlFor='doctor-image' className='group relative cursor-pointer'>
              <img
                className='h-40 w-40 rounded-[28px] border border-white/20 object-cover shadow-lg'
                src={previewImage}
                alt='Doctor profile'
              />
              <div className='absolute inset-0 flex items-center justify-center rounded-[28px] bg-slate-900/45 text-sm font-medium opacity-0 transition group-hover:opacity-100'>
                Change Photo
              </div>
            </label>
            <input
              id='doctor-image'
              type='file'
              accept='image/*'
              hidden
              onChange={(event) => setImage(event.target.files[0])}
            />
            <h1 className='mt-5 text-3xl font-semibold'>{doctorProfile.name}</h1>
            <p className='mt-2 text-cyan-100'>{doctorProfile.speciality}</p>
          </div>

          <div className='mt-8 grid gap-4'>
            <div className='rounded-3xl bg-white/10 p-4 backdrop-blur'>
              <p className='text-sm text-cyan-100'>Education</p>
              <p className='mt-2 font-medium'>{doctorProfile.degree}</p>
            </div>
            <div className='rounded-3xl bg-white/10 p-4 backdrop-blur'>
              <p className='text-sm text-cyan-100'>Email</p>
              <p className='mt-2 font-medium'>{doctorProfile.email}</p>
            </div>
            <div className='rounded-3xl bg-white/10 p-4 backdrop-blur'>
              <p className='text-sm text-cyan-100'>Practice Address</p>
              <p className='mt-2 font-medium'>{profileAddress || 'No address added'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='text-2xl font-semibold text-slate-900'>Edit Details</h2>
              <p className='text-sm text-slate-500'>Update your profile photo and professional details.</p>
            </div>
            <button type='submit' className='rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white'>
              Save Changes
            </button>
          </div>

          <div className='mt-8 grid gap-5 md:grid-cols-2'>
            <div className='md:col-span-2 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4'>
              <div className='flex items-center gap-4'>
                <img className='h-20 w-20 rounded-2xl object-cover bg-white' src={previewImage} alt='Preview' />
                <div>
                  <p className='font-medium text-slate-900'>Profile Photo</p>
                  <p className='mt-1 text-sm text-slate-500'>Use a clear professional headshot for your doctor account.</p>
                </div>
              </div>
            </div>

            <label className='grid gap-2 text-sm text-slate-600'>
              Full Name
              <input
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary'
              />
            </label>

            <label className='grid gap-2 text-sm text-slate-600'>
              Speciality
              <input
                name='speciality'
                value={formData.speciality}
                onChange={handleChange}
                className='rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary'
              />
            </label>

            <label className='grid gap-2 text-sm text-slate-600'>
              Experience
              <input
                name='experience'
                value={formData.experience}
                onChange={handleChange}
                className='rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary'
              />
            </label>

            <label className='grid gap-2 text-sm text-slate-600'>
              Consultation Fee
              <input
                name='fee'
                type='number'
                value={formData.fee}
                onChange={handleChange}
                className='rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary'
              />
            </label>

            <label className='grid gap-2 text-sm text-slate-600 md:col-span-2'>
              Degree
              <input
                name='degree'
                value={formData.degree}
                onChange={handleChange}
                className='rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary'
              />
            </label>

            <label className='grid gap-2 text-sm text-slate-600 md:col-span-2'>
              Address Line 1
              <input
                name='line1'
                value={formData.address.line1}
                onChange={handleAddressChange}
                className='rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary'
              />
            </label>

            <label className='grid gap-2 text-sm text-slate-600 md:col-span-2'>
              Address Line 2
              <input
                name='line2'
                value={formData.address.line2}
                onChange={handleAddressChange}
                className='rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary'
              />
            </label>

            <label className='grid gap-2 text-sm text-slate-600 md:col-span-2'>
              About
              <textarea
                name='about'
                rows='5'
                value={formData.about}
                onChange={handleChange}
                className='rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary'
              />
            </label>

            <label className='flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 md:col-span-2'>
              <input
                name='available'
                type='checkbox'
                checked={formData.available}
                onChange={handleChange}
              />
              Available for booking
            </label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DoctorProfile
