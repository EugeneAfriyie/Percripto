import { ToastContainer } from 'react-toastify'
import Login from './pages/Login'
import { AdminContext } from './context/AdminContext'
import { useContext } from 'react'

const App = () => {
  const { adminToken } = useContext(AdminContext)

  return adminToken ? (
    <div className=' '>
      <ToastContainer
        position="top-right"
        autoClose={3000}     // disappears after 3s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

    </div> 
    ) : (
    <>
    <Login />
      <ToastContainer
        position="top-right"
        autoClose={3000}     // disappears after 3s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
    )
  
}

export default App