import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdmincontextProvider from './context/AdminContext.jsx'
import AppcontextProvider from './context/AppContext.jsx'
import DoctorcontextProvider from './context/DoctorContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AdmincontextProvider>
    <AppcontextProvider>
      <DoctorcontextProvider>
          <App /> 

      </DoctorcontextProvider>
    </AppcontextProvider>

  </AdmincontextProvider>
  </BrowserRouter>,
)
