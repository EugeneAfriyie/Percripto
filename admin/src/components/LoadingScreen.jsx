import React from 'react'

const LoadingScreen = ({ title = 'Loading', message = 'Please wait while we prepare your workspace.' }) => {
  return (
    <div className='w-full p-4 sm:p-6 lg:p-8'>
      <div className='overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm'>
        <div className='h-2 w-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 animate-pulse' />
        <div className='grid gap-8 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr]'>
          <div className='space-y-5'>
            <div className='h-5 w-32 rounded-full bg-slate-200 animate-pulse' />
            <div className='h-12 w-2/3 rounded-2xl bg-slate-200 animate-pulse' />
            <div className='h-4 w-full rounded-full bg-slate-100 animate-pulse' />
            <div className='h-4 w-5/6 rounded-full bg-slate-100 animate-pulse' />
            <div className='grid grid-cols-2 gap-4 pt-3'>
              <div className='h-24 rounded-3xl bg-slate-100 animate-pulse' />
              <div className='h-24 rounded-3xl bg-slate-100 animate-pulse' />
            </div>
          </div>

          <div className='rounded-[28px] bg-slate-50 p-8 text-center'>
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm'>
              <div className='h-10 w-10 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin' />
            </div>
            <p className='mt-6 text-2xl font-semibold text-slate-900'>{title}</p>
            <p className='mt-3 text-sm leading-6 text-slate-500'>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
