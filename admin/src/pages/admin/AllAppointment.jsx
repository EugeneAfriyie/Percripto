import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import LoadingScreen from '../../components/LoadingScreen'

const AllAppointment = () => {
  const { calculateAge, slotDateFormat, currencySymbol } = useContext(AppContext)
  const { getAllAppointments, appointments, adminToken, cancelAppointment, appointmentsLoading } = useContext(AdminContext)

  useEffect(() => {
    if (adminToken) {
      getAllAppointments()
    }
  }, [adminToken])

  if (appointmentsLoading && appointments.length === 0) {
    return <LoadingScreen title='Loading appointments' message='Fetching appointment records, payment states, and doctor assignments.' />
  }

  return (
    <div className='w-full p-4 sm:p-6 lg:p-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-900'>All Appointments</h1>
          <p className='text-sm text-slate-500'>Review every booking, payment state, and cancellation from one place.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200'>
          {appointments.length} total appointments
        </div>
      </div>

      <div className='mt-6 grid gap-4'>
        {appointments.length === 0 && (
          <div className='rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm'>
            No appointments found.
          </div>
        )}

        {appointments.map((item, index) => (
          <div key={index} className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex items-center gap-4'>
                <img className='h-16 w-16 rounded-3xl object-cover' src={item.userdata.image} alt={item.userdata.name} />
                <div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='text-lg font-semibold text-slate-900'>{item.userdata.name}</p>
                    <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'>
                      {calculateAge(item.userdata.DOB)} yrs
                    </span>
                  </div>
                  <p className='mt-1 text-sm text-slate-500'>{item.userdata.gender || 'Patient'}</p>
                </div>
              </div>

              <div className='flex flex-wrap gap-2 text-sm text-slate-600'>
                <span className='rounded-full bg-sky-50 px-3 py-1.5 text-sky-700'>{slotDateFormat(item.slotdate)}</span>
                <span className='rounded-full bg-slate-100 px-3 py-1.5'>{item.slotTime}</span>
                <span className='rounded-full bg-violet-50 px-3 py-1.5 text-violet-700'>
                  {currencySymbol}
                  {item.doctorData.fee.toFixed(2)}
                </span>
                <span className={`rounded-full px-3 py-1.5 ${item.payment ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {item.payment ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>

            <div className='mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-3'>
                <img className='h-12 w-12 rounded-2xl object-cover bg-slate-100' src={item.doctorData.image} alt={item.doctorData.name} />
                <div>
                  <p className='font-medium text-slate-900'>{item.doctorData.name}</p>
                  <p className='text-sm text-slate-500'>{item.doctorData.speciality}</p>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-3'>
                {item.cancelled ? (
                  <span className='rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-600'>Cancelled</span>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50'
                  >
                    Cancel Appointment
                  </button>
                )}

                {item.isCompleted && (
                  <span className='rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700'>Completed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointment
