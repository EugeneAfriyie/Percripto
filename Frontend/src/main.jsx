import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'

const routerBasename = import.meta.env.VITE_ROUTER_BASENAME || '/'

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={routerBasename}>

  <AppContextProvider>

    <App /> 
  </AppContextProvider>
  </BrowserRouter>,
)
