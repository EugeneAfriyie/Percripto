import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import LoadingScreen from '../../components/LoadingScreen'

const DoctorDashboard = () => {
  const { doctorProfile, doctorDashData, getDoctorDashboard, getDoctorProfile, doctorToken, doctorProfileLoading, doctorDashLoading } =
    useContext(DoctorContext)
  const { slotDateFormat, currencySymbol } = useContext(AppContext)

  useEffect(() => {
    if (doctorToken) {
      getDoctorProfile()
      getDoctorDashboard()
    }
  }, [doctorToken])

  if (doctorProfileLoading || doctorDashLoading || !doctorProfile || !doctorDashData) {
    return <LoadingScreen title='Loading doctor dashboard' message='Preparing today&apos;s schedule, earnings, and care activity.' />
  }

  const statCards = [
    {
      label: 'Appointments',
      value: doctorDashData.appointments,
      accent: 'from-sky-500 to-cyan-400',
    },
    {
      label: 'Patients',
      value: doctorDashData.patients,
      accent: 'from-emerald-500 to-teal-400',
    },
    {
      label: 'Earnings',
      value: `${currencySymbol}${doctorDashData.earnings}`,
      accent: 'from-violet-500 to-fuchsia-400',
    },
    {
      label: 'Availability',
      value: doctorProfile.available ? 'Open' : 'Closed',
      accent: 'from-amber-500 to-orange-400',
    },
  ]

  const profileAddress = [doctorProfile.address?.line1, doctorProfile.address?.line2]
    .filter(Boolean)
    .join(', ')

  return (
    <div className='w-full p-4 sm:p-6 lg:p-8'>
      <div className='rounded-[28px] bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 px-6 py-8 text-white shadow-xl'>
        <p className='text-sm uppercase tracking-[0.35em] text-cyan-100'>Doctor Workspace</p>
        <div className='mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <h1 className='text-3xl font-semibold sm:text-4xl'>{doctorProfile.name}</h1>
            <p className='mt-2 max-w-2xl text-sm text-slate-100 sm:text-base'>
              {doctorProfile.speciality} dashboard for managing appointments, patient flow, and
              daily clinic visibility.
            </p>
          </div>

          <div className='grid gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur sm:min-w-72'>
            <div>
              <p className='text-xs uppercase tracking-[0.25em] text-cyan-100'>Practice Details</p>
              <p className='mt-1 text-lg font-semibold'>{doctorProfile.degree}</p>
            </div>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div className='rounded-2xl bg-white/10 p-3'>
                <p className='text-cyan-100'>Experience</p>
                <p className='mt-1 font-semibold'>{doctorProfile.experience}</p>
              </div>
              <div className='rounded-2xl bg-white/10 p-3'>
                <p className='text-cyan-100'>Session Fee</p>
                <p className='mt-1 font-semibold'>
                  {currencySymbol}
                  {doctorProfile.fee}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {statCards.map((card) => (
          <div key={card.label} className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className={`h-2 w-24 rounded-full bg-gradient-to-r ${card.accent}`} />
            <p className='mt-4 text-sm text-slate-500'>{card.label}</p>
            <p className='mt-2 text-3xl font-semibold text-slate-900'>{card.value}</p>
          </div>
        ))}
      </div>

      <div className='mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]'>
        <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-lg font-semibold text-slate-900'>Latest Appointments</p>
              <p className='text-sm text-slate-500'>Recent appointments assigned to this doctor.</p>
            </div>
            <div className='rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600'>
              {doctorDashData.latestAppointments.length} listed
            </div>
          </div>

          <div className='mt-6 space-y-4'>
            {doctorDashData.latestAppointments.length === 0 && (
              <div className='rounded-3xl bg-slate-50 p-5 text-sm text-slate-500'>
                No appointments yet.
              </div>
            )}

            {doctorDashData.latestAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className='flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between'
              >
                <div className='flex items-center gap-3'>
                  <img
                    className='h-14 w-14 rounded-2xl object-cover'
                    src={appointment.userdata.image}
                    alt={appointment.userdata.name}
                  />
                  <div>
                    <p className='font-semibold text-slate-900'>{appointment.userdata.name}</p>
                    <p className='text-sm text-slate-500'>
                      {appointment.cancelled
                        ? 'Cancelled'
                        : appointment.isCompleted
                          ? 'Completed'
                          : 'Scheduled'}
                    </p>
                  </div>
                </div>
                <div className='flex flex-wrap gap-2 text-sm text-slate-600'>
                  <span className='rounded-full bg-white px-3 py-1.5'>
                    {slotDateFormat(appointment.slotdate)}
                  </span>
                  <span className='rounded-full bg-white px-3 py-1.5'>{appointment.slotTime}</span>
                  <span className='rounded-full bg-white px-3 py-1.5'>
                    {currencySymbol}
                    {appointment.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-6'>
          <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <p className='text-lg font-semibold text-slate-900'>Profile Snapshot</p>
            <div className='mt-5 space-y-4'>
              <div className='rounded-3xl bg-cyan-50 p-4'>
                <p className='text-sm text-cyan-700'>About</p>
                <p className='mt-2 text-sm leading-6 text-slate-700'>{doctorProfile.about}</p>
              </div>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='rounded-3xl bg-slate-50 p-4'>
                  <p className='text-sm text-slate-500'>Email</p>
                  <p className='mt-1 font-medium text-slate-900'>{doctorProfile.email}</p>
                </div>
                <div className='rounded-3xl bg-slate-50 p-4'>
                  <p className='text-sm text-slate-500'>Availability</p>
                  <p className='mt-1 font-medium text-slate-900'>
                    {doctorProfile.available ? 'Available for booking' : 'Not available'}
                  </p>
                </div>
                <div className='rounded-3xl bg-slate-50 p-4 sm:col-span-2'>
                  <p className='text-sm text-slate-500'>Address</p>
                  <p className='mt-1 font-medium text-slate-900'>{profileAddress || 'No address added'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
