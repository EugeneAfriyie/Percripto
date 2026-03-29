import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingScreen from '../components/LoadingScreen'
import LoadingButton from '../components/LoadingButton'

const My_Appointment = () => {
  const { backendUrl, token } = useContext(AppContext)
  const [appointment, setAppointment] = useState([])
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotdate) => {
    const dataArray = slotdate.split('-')
    const day = dataArray[0]
    const month = dataArray[1]
    const year = dataArray[2]

    return day + ' ' + months[Number(month - 1)] + ' ' + year
  }

  const location = useLocation()
  const navigate = useNavigate()

  const appointmentPaystack = async (appointmentId) => {
    try {
      setActionLoading(`pay-${appointmentId}`)
      const { data } = await axios.post(backendUrl + '/api/user/appointment-paystack', { appointmentId }, { headers: { token } })

      if (data.success) {
        window.location.href = data.authorization_url
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setActionLoading('')
    }
  }

  const verifyPaystackPayment = async (reference) => {
    if (!reference || !token || verifyingPayment) {
      return
    }

    try {
      setVerifyingPayment(true)
      const { data } = await axios.post(
        backendUrl + '/api/user/verify-paystack',
        { reference },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        await getAppointment()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setVerifyingPayment(false)
      navigate('/my_appointment', { replace: true })
    }
  }

  const getAppointment = async () => {
    try {
      setAppointmentsLoading(true)
      const { data } = await axios.get(backendUrl + '/api/user/appointment', { headers: { token } })
      if (data.success) {
        setAppointment(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setAppointmentsLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      setActionLoading(`cancel-${appointmentId}`)
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getAppointment()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setActionLoading('')
    }
  }

  useEffect(() => {
    if (token) {
      getAppointment()
    }
  }, [token])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const reference = searchParams.get('reference') || searchParams.get('trxref')

    if (token && reference) {
      verifyPaystackPayment(reference)
    }
  }, [location.search, token])

  if ((appointmentsLoading && appointment.length === 0) || verifyingPayment) {
    return (
      <LoadingScreen
        title={verifyingPayment ? 'Verifying payment' : 'Loading appointments'}
        message={verifyingPayment ? 'We are confirming your payment and updating the appointment status.' : 'Gathering your upcoming sessions and booking history.'}
      />
    )
  }

  return (
    <div className='py-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-900'>My Appointments</h1>
          <p className='text-sm text-slate-500'>Track your doctor visits, payment status, and upcoming sessions in one place.</p>
        </div>
        <div className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm'>
          {appointment.length} appointments
        </div>
      </div>

      <div className='mt-6 grid gap-4'>
        {appointment.length === 0 && (
          <div className='rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm'>
            You have no appointments yet.
          </div>
        )}

        {appointment.map((item, index) => (
          <div key={index} className='rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex items-center gap-4'>
                <img className='h-24 w-24 rounded-[24px] bg-indigo-50 object-cover' src={item.doctorData.image} alt='' />
                <div className='text-sm text-zinc-600'>
                  <p className='text-xl font-semibold text-slate-900'>{item.doctorData.name}</p>
                  <p className='mt-1'>{item.doctorData.speciality}</p>
                  <p className='mt-3 text-sm font-medium text-slate-700'>Address</p>
                  <p className='text-xs'>{item.doctorData.address.line1}</p>
                  <p className='text-xs'>{item.doctorData.address.line2}</p>
                  <p className='mt-3 text-sm'>
                    <span className='font-medium text-slate-800'>Date & Time:</span> {slotDateFormat(item.slotdate)} | {item.slotTime}
                  </p>
                </div>
              </div>

              <div className='flex flex-wrap gap-2 text-sm'>
                <span className={`rounded-full px-3 py-1.5 ${item.payment ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {item.payment ? 'Paid' : 'Awaiting payment'}
                </span>
                <span className={`rounded-full px-3 py-1.5 ${item.cancelled ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'}`}>
                  {item.cancelled ? 'Cancelled' : 'Active booking'}
                </span>
              </div>
            </div>

            <div className='mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end'>
              {!item.cancelled && !item.payment && (
                <LoadingButton
                  onClick={() => appointmentPaystack(item._id)}
                  loading={actionLoading === `pay-${item._id}`}
                  loadingText='Redirecting...'
                  className='rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-primary hover:text-white'
                >
                  Pay Online
                </LoadingButton>
              )}

              {!item.cancelled && (
                <LoadingButton
                  onClick={() => cancelAppointment(item._id)}
                  loading={actionLoading === `cancel-${item._id}`}
                  loadingText='Cancelling...'
                  className='rounded-full border border-rose-200 px-5 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50'
                >
                  Cancel Appointment
                </LoadingButton>
              )}

              {item.payment && (
                <button className='rounded-full border border-emerald-500 px-5 py-3 text-sm font-medium text-emerald-600'>
                  Payment Successful
                </button>
              )}

              {item.cancelled && (
                <button className='rounded-full border border-red-500 px-5 py-3 text-sm font-medium text-red-500'>
                  Appointment Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default My_Appointment
