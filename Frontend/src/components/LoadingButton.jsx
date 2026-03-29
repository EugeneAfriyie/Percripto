import React from 'react'

const LoadingButton = ({
  loading = false,
  children,
  loadingText = 'Please wait...',
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${className} ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
    >
      <span className='inline-flex items-center justify-center gap-2'>
        {loading && <span className='h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin' />}
        {loading ? loadingText : children}
      </span>
    </button>
  )
}

export default LoadingButton
