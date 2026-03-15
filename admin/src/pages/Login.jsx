import React from 'react'

const Login = () => {
    const[state, setState] = React.useState("Admin")
  return (
   <form action="">
        <div className="">
            <p>
                <span>{state} </span>
                Login
            </p>
        </div>
   </form>
  )
}

export default Login