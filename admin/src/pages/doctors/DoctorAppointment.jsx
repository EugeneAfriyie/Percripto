import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorAppointment = () => {
  const { doctorAppointments, getDoctorAppointments, completeAppointment, cancelAppointment, doctorToken } =
    useContext(DoctorContext)
  const { calculateAge, slotDateFormat, currencySymbol } = useContext(AppContext)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (doctorToken) {
      getDoctorAppointments()
    }
  }, [doctorToken])

  const getAppointmentStatus = (appointment) => {
    if (appointment.cancelled) return 'cancelled'
    if (appointment.isCompleted) return 'completed'
    return 'scheduled'
  }

  const filteredAppointments =
    statusFilter === 'all'
      ? doctorAppointments
      : doctorAppointments.filter((appointment) => getAppointmentStatus(appointment) === statusFilter)

  return (
    <div className='w-full p-4 sm:p-6 lg:p-8'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-900'>Appointments</h1>
          <p className='text-sm text-slate-500'>Review, complete, or cancel your patient bookings.</p>
        </div>

        <div className='flex flex-wrap gap-2'>
          {['all', 'scheduled', 'completed', 'cancelled'].map((filter) => (
            <button
              key={filter}
              type='button'
              onClick={() => setStatusFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                statusFilter === filter
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-6 grid gap-4'>
        {filteredAppointments.length === 0 && (
          <div className='rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm'>
            No appointments found for this filter.
          </div>
        )}

        {filteredAppointments.map((appointment) => {
          const appointmentStatus = getAppointmentStatus(appointment)

          return (
            <div key={appointment._id} className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
              <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex items-center gap-4'>
                  <img
                    className='h-16 w-16 rounded-3xl object-cover'
                    src={appointment.userdata.image}
                    alt={appointment.userdata.name}
                  />
                  <div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='text-lg font-semibold text-slate-900'>{appointment.userdata.name}</p>
                      <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'>
                        {calculateAge(appointment.userdata.DOB)} yrs
                      </span>
                    </div>
                    <p className='mt-1 text-sm text-slate-500'>{appointment.userdata.gender}</p>
                  </div>
                </div>

                <div className='flex flex-wrap gap-2 text-sm text-slate-600'>
                  <span className='rounded-full bg-sky-50 px-3 py-1.5 text-sky-700'>
                    {slotDateFormat(appointment.slotdate)}
                  </span>
                  <span className='rounded-full bg-slate-100 px-3 py-1.5'>{appointment.slotTime}</span>
                  <span className='rounded-full bg-violet-50 px-3 py-1.5 text-violet-700'>
                    {currencySymbol}
                    {appointment.amount}
                  </span>
                  <span className='rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700'>
                    {appointment.payment ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>

              <div className='mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between'>
                <span
                  className={`w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                    appointmentStatus === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : appointmentStatus === 'cancelled'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {appointmentStatus}
                </span>

                <div className='flex flex-wrap gap-3'>
                  {!appointment.cancelled && !appointment.isCompleted && (
                    <button
                      type='button'
                      onClick={() => completeAppointment(appointment._id)}
                      className='rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700'
                    >
                      Mark Completed
                    </button>
                  )}

                  {!appointment.cancelled && !appointment.isCompleted && (
                    <button
                      type='button'
                      onClick={() => cancelAppointment(appointment._id)}
                      className='rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50'
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DoctorAppointment
