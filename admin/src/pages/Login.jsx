import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { DoctorContext } from '../context/DoctorContext'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { setAdminToken, backendUrl } = useContext(AdminContext)
  const { setDoctorToken } = useContext(DoctorContext)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setState(location.pathname.startsWith('/doctor') ? 'Doctor' : 'Admin')
  }, [location.pathname])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const url = state === 'Admin' ? `${backendUrl}/api/admin/login` : `${backendUrl}/api/doctor/login`

    try {
      const { data } = await axios.post(url, { email, password })

      if (data.success) {
        if (state === 'Admin') {
          localStorage.removeItem('doctorToken')
          setDoctorToken('')
          localStorage.setItem('adminToken', data.token)
          setAdminToken(data.token)
          navigate('/admin/dashboard')
        } else {
          localStorage.removeItem('adminToken')
          setAdminToken(null)
          localStorage.setItem('doctorToken', data.token)
          setDoctorToken(data.token)
          navigate('/doctor/dashboard')
        }
        toast.success(`${state} Login Successful`)
      } else {
        toast.error(data.message || 'Invalid email or password')
      }
    } catch (error) {
      console.error('Login failed:', error)
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Invalid email or password')
      } else {
        toast.error('Server Error. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_#f8fafc_42%,_#dbeafe_100%)] px-4 py-10'>
      <div className='mx-auto grid min-h-[85vh] max-w-6xl overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.14)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr]'>
        <div className='relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-sky-900 to-cyan-600 p-10 text-white lg:block'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_38%),linear-gradient(135deg,transparent,rgba(255,255,255,0.08))]' />
          <div className='relative z-10 flex h-full flex-col justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.45em] text-cyan-100'>Percripto Console</p>
              <h1 className='mt-6 max-w-md text-5xl font-semibold leading-tight'>
                Elegant control for admins and doctors.
              </h1>
              <p className='mt-6 max-w-lg text-base leading-7 text-slate-100'>
                Access schedules, profiles, appointments, and clinic operations from one polished workspace designed for daily healthcare flow.
              </p>
            </div>

            <div className='grid gap-4'>
              <div className='rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur'>
                <p className='text-sm uppercase tracking-[0.3em] text-cyan-100'>What You Can Do</p>
                <div className='mt-4 grid gap-3 text-sm text-slate-100'>
                  <p>Manage doctor availability and bookings without leaving the dashboard.</p>
                  <p>Keep profile images and professional details up to date for a trusted patient-facing experience.</p>
                  <p>Switch cleanly between admin oversight and doctor workflow access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='flex items-center px-6 py-10 sm:px-10 lg:px-14'>
          <div className='w-full'>
            <div className='flex items-center gap-2 rounded-full bg-slate-100 p-1 text-sm font-medium text-slate-600'>
              <button
                type='button'
                onClick={() => {
                  setState('Admin')
                  navigate('/admin/login')
                }}
                className={`flex-1 rounded-full px-4 py-2 transition ${state === 'Admin' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
              >
                Admin
              </button>
              <button
                type='button'
                onClick={() => {
                  setState('Doctor')
                  navigate('/doctor/login')
                }}
                className={`flex-1 rounded-full px-4 py-2 transition ${state === 'Doctor' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
              >
                Doctor
              </button>
            </div>

            <div className='mt-8'>
              <p className='text-sm uppercase tracking-[0.35em] text-sky-700'>{state} Access</p>
              <h2 className='mt-3 text-4xl font-semibold text-slate-900'>Welcome back</h2>
              <p className='mt-3 text-sm leading-6 text-slate-500'>
                Sign in to continue to your secure clinic workspace.
              </p>
            </div>

            <div className='mt-8 grid gap-5'>
              <label className='grid gap-2 text-sm text-slate-600'>
                Email
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white'
                  type='email'
                  placeholder='Enter your email'
                  required
                />
              </label>

              <label className='grid gap-2 text-sm text-slate-600'>
                Password
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white'
                  type='password'
                  placeholder='Enter your password'
                  required
                />
              </label>

              <button
                disabled={isLoading}
                className='mt-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-base font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70'
              >
                {isLoading ? 'Signing in...' : `Login as ${state}`}
              </button>
            </div>

            <div className='mt-8 rounded-3xl bg-sky-50 p-5 text-sm text-slate-600'>
              <p className='font-medium text-slate-900'>Quick switch</p>
              <p className='mt-2 leading-6'>
                Need a different workspace? Use the toggle above to move between admin and doctor access without leaving this screen.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
