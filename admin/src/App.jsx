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

const adminPrefix = import.meta.env.VITE_ADMIN_PREFIX || ''
const doctorPrefix = import.meta.env.VITE_DOCTOR_PREFIX || '/doctor'

const withPrefix = (prefix, path = '') => `${prefix}${path}`

const App = () => {
  const { adminToken, setAdminToken } = useContext(AdminContext)
  const { doctorToken, setDoctorToken } = useContext(DoctorContext)
  const location = useLocation()

  const isDoctorPath = location.pathname.startsWith(doctorPrefix)
  const adminLoginRoute = withPrefix(adminPrefix, '/login')
  const doctorLoginRoute = withPrefix(doctorPrefix, '/login')
  const adminDashboardRoute = withPrefix(adminPrefix, '/dashboard')
  const doctorDashboardRoute = withPrefix(doctorPrefix, '/dashboard')
  const loginRoute = isDoctorPath ? doctorLoginRoute : adminLoginRoute
  const defaultRoute = adminToken ? adminDashboardRoute : doctorDashboardRoute

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
          <Route path='/' element={<Navigate to={adminLoginRoute} replace />} />
          <Route path={adminPrefix || '/admin'} element={<Navigate to={adminLoginRoute} replace />} />
          <Route path={doctorPrefix} element={<Navigate to={doctorLoginRoute} replace />} />
          <Route path={adminLoginRoute} element={<Login />} />
          <Route path={doctorLoginRoute} element={<Login />} />
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
          <Route path={adminPrefix || '/admin'} element={<Navigate to={adminDashboardRoute} replace />} />
          <Route path={doctorPrefix} element={<Navigate to={doctorDashboardRoute} replace />} />

          <Route path={adminDashboardRoute} element={<DashBoard />} />
          <Route path={withPrefix(adminPrefix, '/appointments')} element={<AllAppointment />} />
          <Route path={withPrefix(adminPrefix, '/add-doctor')} element={<AddDoc />} />
          <Route path={withPrefix(adminPrefix, '/doctors')} element={<DocList />} />
          <Route path={withPrefix(adminPrefix, '/profile')} element={<AdminProfile />} />

          <Route path={doctorDashboardRoute} element={<DoctorDashboard />} />
          <Route path={withPrefix(doctorPrefix, '/profile')} element={<DoctorProfile />} />
          <Route path={withPrefix(doctorPrefix, '/appointments')} element={<DoctorAppointment />} />

          <Route path={adminLoginRoute} element={<Navigate to={adminDashboardRoute} replace />} />
          <Route path={doctorLoginRoute} element={<Navigate to={doctorDashboardRoute} replace />} />
          <Route path='*' element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
