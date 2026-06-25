import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './Appointment'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Invoices from './pages/Invoices'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <ToastContainer position='top-right' autoClose={3000} />
      <Navbar />
      <div className='mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-10'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} /> 
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointment />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/invoices' element={<Invoices />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}

export default App
