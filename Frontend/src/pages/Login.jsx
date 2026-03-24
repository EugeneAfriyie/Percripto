import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state,setState] = React.useState("Sign up")
  const [email,setEmail] = React.useState("")
  const [password,setPassword] = React.useState("")
  const [name,setName] = React.useState("")
  const {backendUrl,token,setToken} = useContext(AppContext)
  const navigate = useNavigate()


  const onSubmit = async(e) => {
    e.preventDefault()
      try {
        if (state === "Sign up") {
          const { data } = await axios.post(backendUrl + "/api/user/register", {
            name,
            email,
            password
          })
          if (data.success) {
            localStorage.setItem("token", data.token)
            setToken(data.token)
          } else {
            toast.error(data.message)
          }
          }else{
             const { data } = await axios.post(backendUrl + "/api/user/login", {
            email,
            password 
          })
          if (data.success) {
            localStorage.setItem("token", data.token)
            setToken(data.token)
          } else {
            toast.error(data.message)
          }
          }
        

        
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }

  useEffect(() => {
      if(token){
        // window.location.href = "/"
        navigate('/')
      }
  },[token]
)

  return (
    <form onSubmit={onSubmit} className='min-h-[80vh flex items-center' action="">

      <div className=" flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm  shadow-lg">
        <p className='text-2xl font-semibold  '>
          {state === "Sign up" ? "Create Account" : "Login"}
        </p>
        <p>Please {state === "Sign up" ? "sign up" : "log in"}  to book an appointment</p>

        {state === "Sign up" &&
        
        <div className=" w-full ">
          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1 ' required onChange={(e) => setName(e.target.value)} value={name} type="text" />
        </div>
        }


        <div className="w-full">
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1 ' required onChange={(e) => setEmail(e.target.value)} value={email} type="email" />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1 ' required onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
        </div>

        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer'>{state === "Sign up" ? "Create Account" : "Login"}</button>

        {state === "Sign up" ?
          <p className='text-sm text-gray-500'>Already have an account? <span onClick={() => setState("Login")} className='text-primary cursor-pointer'>Login</span></p>
          :
          <p className='text-sm text-gray-500'>Don't have an account? <span onClick={() => setState("Sign up")} className='text-primary cursor-pointer'>Sign up</span></p>
        }
      </div>
    </form>
  )
}

export default Login 