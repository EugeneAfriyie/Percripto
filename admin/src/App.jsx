import { ToastContainer, toast } from 'react-toastify'
import Login from './pages/Login'
import { AdminContext } from './context/AdminContext'
import { useContext, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AddDoc from './pages/admin/AddDoc'
import DocList from './pages/admin/DocList'
import DashBoard from './pages/admin/DashBoard'
import AllAppointment from './pages/admin/AllAppointment'
import AdminProfile from './pages/admin/AdminProfile'
import { DoctorContext } from './context/DoctorContext'
import DoctorProfile from './pages/doctors/DoctorProfile'
import DoctorDashboard from './pages/doctors/DoctorDashboard'
import DoctorAppointment from './pages/doctors/DoctorAppointment'

const App = () => {
  const { adminToken, setAdminToken } = useContext(AdminContext)
  const { doctorToken, setDoctorToken } = useContext(DoctorContext)
  const location = useLocation()

  const isDoctorPath = location.pathname.startsWith('/doctor')
  const loginRoute = isDoctorPath ? '/doctor/login' : '/admin/login'
  const defaultRoute = adminToken ? '/admin/dashboard' : '/doctor/dashboard'

  useEffect(() => {
    if (adminToken) {
      try {
        const payload = JSON.parse(atob(adminToken.split('.')[1]))
        const isExpired = payload.exp * 1000 < Date.now()

        if (isExpired) {
          localStorage.removeItem('adminToken')
          setAdminToken(null)
          toast.info('Session expired. Please log in again.')
        }
      } catch (error) {
        localStorage.removeItem('adminToken')
        setAdminToken(null)
      }
    }
  }, [adminToken, setAdminToken])

  useEffect(() => {
    if (doctorToken) {
      try {
        const payload = JSON.parse(atob(doctorToken.split('.')[1]))
        const isExpired = payload.exp * 1000 < Date.now()

        if (isExpired) {
          localStorage.removeItem('doctorToken')
          setDoctorToken(null)
          toast.info('Doctor session expired. Please log in again.')
        }
      } catch (error) {
        localStorage.removeItem('doctorToken')
        setDoctorToken(null)
      }
    }
  }, [doctorToken, setDoctorToken])

  if (!(adminToken || doctorToken)) {
    return (
      <>
        <Routes>
          <Route path='/' element={<Navigate to='/admin/login' replace />} />
          <Route path='/admin' element={<Navigate to='/admin/login' replace />} />
          <Route path='/doctor' element={<Navigate to='/doctor/login' replace />} />
          <Route path='/admin/login' element={<Login />} />
          <Route path='/doctor/login' element={<Login />} />
          <Route path='*' element={<Navigate to={loginRoute} replace />} />
        </Routes>
        <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      </>
    )
  }

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_#eff6ff,_#f8fafc_42%,_#eef2ff_100%)]'>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />

      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Navigate to={defaultRoute} replace />} />
          <Route path='/admin' element={<Navigate to='/admin/dashboard' replace />} />
          <Route path='/doctor' element={<Navigate to='/doctor/dashboard' replace />} />

          <Route path='/admin/dashboard' element={<DashBoard />} />
          <Route path='/admin/appointments' element={<AllAppointment />} />
          <Route path='/admin/add-doctor' element={<AddDoc />} />
          <Route path='/admin/doctors' element={<DocList />} />
          <Route path='/admin/profile' element={<AdminProfile />} />

          <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor/profile' element={<DoctorProfile />} />
          <Route path='/doctor/appointments' element={<DoctorAppointment />} />

          <Route path='/admin/login' element={<Navigate to='/admin/dashboard' replace />} />
          <Route path='/doctor/login' element={<Navigate to='/doctor/dashboard' replace />} />
          <Route path='*' element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
