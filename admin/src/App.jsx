import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext'
import { AdminContext } from './context/AdminContext'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import Login from './pages/Login'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorProfile from './pages/Doctor/DoctorProfile'

const AppShell = ({ children }) => (
  <div className='min-h-screen bg-[#f7fbfa] text-slate-900'>
    <ToastContainer />
    <Navbar />
    <div className='flex items-start'>
      <Sidebar />
      <main className='min-h-[calc(100vh-73px)] w-full min-w-0 overflow-x-hidden p-4 pb-24 sm:p-6 sm:pb-24 md:pb-6'>
        {children}
      </main>
    </div>
  </div>
)

const App = () => {
  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const location = useLocation()

  if (location.pathname === '/') {
    if (aToken) return <Navigate to="/admin-dashboard" replace />
    if (dToken) return <Navigate to="/doctor-dashboard" replace />
  }

  if (aToken) {
    return (
      <AppShell>
        <Routes>
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />
          <Route path="*" element={<Navigate to="/admin-dashboard" />} />
        </Routes>
      </AppShell>
    )
  }

  if (dToken) {
    return (
      <AppShell>
        <Routes>
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="*" element={<Navigate to="/doctor-dashboard" />} />
        </Routes>
      </AppShell>
    )
  }

  return (
    <div className='min-h-screen bg-[#f7fbfa]'>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
