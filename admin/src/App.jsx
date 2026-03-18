import { ToastContainer } from 'react-toastify'
import Login from './pages/Login'
import { AdminContext } from './context/AdminContext'
import { useContext } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import AddDoc from './pages/admin/AddDoc'
import DocList from './pages/admin/DocList'

const App = () => {
  const { adminToken } = useContext(AdminContext)

  return adminToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer
        position="top-right"
        autoClose={3000}     // disappears after 3s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Navbar />
      <Sidebar />

      <Routes>

        <Route path='/' element={<></> } />
        <Route path='/admin_dashboard' element={<Dash />} />
        <Route path='/all-appointment' element={<AllAppointment />} />
        <Route path='/add_doctor' element={<AddDoc />} />
        <Route path='/doc_list' element={<DocList />} />

        

      </Routes>


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