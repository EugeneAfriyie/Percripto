import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DocList = () => {
  const { adminToken, doctors, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (adminToken) {
      getAllDoctors()
    }
  }, [adminToken, getAllDoctors])

  return (
    <div className='w-full p-4 sm:p-6 lg:p-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-900'>Doctors</h1>
          <p className='text-sm text-slate-500'>Manage the active doctor network and monitor availability quickly.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200'>
          {doctors.length} doctor profiles
        </div>
      </div>

      <div className='mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {doctors.length === 0 && (
          <div className='rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm'>
            No doctors found.
          </div>
        )}

        {doctors.map((item, index) => (
          <div key={index} className='group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'>
            <div className='relative overflow-hidden bg-gradient-to-br from-sky-50 to-indigo-50 p-4'>
              <img
                className='h-64 w-full rounded-[24px] object-cover transition duration-500 group-hover:scale-[1.03]'
                src={item.image || '/default-doctor.png'}
                alt={item.name}
              />
              <span className={`absolute left-8 top-8 rounded-full px-3 py-1 text-xs font-semibold ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className='p-5'>
              <p className='text-xl font-semibold text-slate-900'>{item.name}</p>
              <p className='mt-1 text-sm text-slate-500'>{item.speciality}</p>
              <p className='mt-3 text-sm text-slate-600'>{item.degree}</p>

              <div className='mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm'>
                <div>
                  <p className='text-slate-500'>Experience</p>
                  <p className='font-medium text-slate-900'>{item.experience}</p>
                </div>
                <div>
                  <p className='text-slate-500'>Fee</p>
                  <p className='font-medium text-slate-900'>${item.fee}</p>
                </div>
              </div>

              <label className='mt-5 flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600'>
                <span>Booking availability</span>
                <input onChange={() => changeAvailability(item._id)} type='checkbox' checked={item.available} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DocList
