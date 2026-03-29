import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import LoadingButton from '../components/LoadingButton'

const Login = () => {
  const [state, setState] = useState('Sign up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (state === 'Sign up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', {
          name,
          email,
          password,
        })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', {
          email,
          password,
        })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const isExpired = payload.exp * 1000 < Date.now()

        if (isExpired) {
          localStorage.removeItem('token')
          setToken(false)
          toast.info('Session expired. Please log in again.')
        } else {
          navigate('/')
        }
      } catch (error) {
        localStorage.removeItem('token')
        setToken(false)
      }
    }
  }, [token, navigate, setToken])

  return (
    <div className='min-h-[82vh] py-8 sm:py-12'>
      <div className='grid overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.02fr_0.98fr]'>
        <div className='relative hidden overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-10 text-white lg:block'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),transparent_35%)]' />
          <div className='relative z-10 flex h-full flex-col justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.4em] text-cyan-100'>Patient Access</p>
              <h1 className='mt-6 max-w-md text-5xl font-semibold leading-tight'>
                Your care journey, beautifully organized.
              </h1>
              <p className='mt-6 max-w-lg text-base leading-7 text-slate-100'>
                Create an account to book faster, manage appointments, and keep your health profile ready whenever you need care.
              </p>
            </div>

            <div className='grid gap-4'>
              <div className='rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur'>
                <p className='text-sm uppercase tracking-[0.28em] text-cyan-100'>Why Sign In</p>
                <div className='mt-4 grid gap-3 text-sm leading-6 text-slate-100'>
                  <p>Book appointments with trusted specialists in a few steps.</p>
                  <p>Update your health profile and contact details anytime.</p>
                  <p>Track upcoming visits and payment status from one place.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className='flex items-center px-6 py-10 sm:px-10 lg:px-14'>
          <div className='w-full'>
            <div className='flex items-center gap-2 rounded-full bg-slate-100 p-1 text-sm font-medium text-slate-600'>
              <button
                type='button'
                onClick={() => setState('Sign up')}
                className={`flex-1 rounded-full px-4 py-2 transition ${state === 'Sign up' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
              >
                Sign up
              </button>
              <button
                type='button'
                onClick={() => setState('Login')}
                className={`flex-1 rounded-full px-4 py-2 transition ${state === 'Login' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
              >
                Login
              </button>
            </div>

            <div className='mt-8'>
              <p className='text-sm uppercase tracking-[0.35em] text-sky-700'>
                {state === 'Sign up' ? 'New Account' : 'Welcome Back'}
              </p>
              <h2 className='mt-3 text-4xl font-semibold text-slate-900'>
                {state === 'Sign up' ? 'Create your patient profile' : 'Login to continue'}
              </h2>
              <p className='mt-3 text-sm leading-6 text-slate-500'>
                {state === 'Sign up'
                  ? 'Set up your account to book appointments and manage your care history.'
                  : 'Access your appointments, saved details, and booking flow.'}
              </p>
            </div>

            <div className='mt-8 grid gap-5'>
              {state === 'Sign up' && (
                <label className='grid gap-2 text-sm text-slate-600'>
                  Full Name
                  <input
                    className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white'
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type='text'
                    placeholder='Enter your full name'
                  />
                </label>
              )}

              <label className='grid gap-2 text-sm text-slate-600'>
                Email
                <input
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white'
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type='email'
                  placeholder='Enter your email'
                />
              </label>

              <label className='grid gap-2 text-sm text-slate-600'>
                Password
                <input
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type='password'
                  placeholder='Enter your password'
                />
              </label>

              <LoadingButton
                type='submit'
                disabled={isLoading}
                className='mt-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-base font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70'
                loading={isLoading}
                loadingText='Please wait...'
              >
                {state === 'Sign up' ? 'Create Account' : 'Login'}
              </LoadingButton>
            </div>

            <div className='mt-8 rounded-3xl bg-sky-50 p-5 text-sm text-slate-600'>
              <p className='font-medium text-slate-900'>
                {state === 'Sign up' ? 'Already registered?' : 'Need an account?'}
              </p>
              <p className='mt-2 leading-6'>
                {state === 'Sign up' ? (
                  <>
                    You can switch to{' '}
                    <span onClick={() => setState('Login')} className='cursor-pointer font-medium text-primary'>
                      login
                    </span>{' '}
                    and continue where you left off.
                  </>
                ) : (
                  <>
                    Create one in a moment by switching to{' '}
                    <span onClick={() => setState('Sign up')} className='cursor-pointer font-medium text-primary'>
                      sign up
                    </span>
                    .
                  </>
                )}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
