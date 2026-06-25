// // import axios from 'axios'
// // import React, { useContext, useState } from 'react'
// // import { DoctorContext } from '../context/DoctorContext'
// // import { AdminContext } from '../context/AdminContext'
// // import { toast } from 'react-toastify'
// // import { assets } from '../assets/assets'

// // const Login = () => {
// //   const [state, setState] = useState('Admin')
// //   const [email, setEmail] = useState('')
// //   const [password, setPassword] = useState('')
// //   const backendUrl = import.meta.env.VITE_BACKEND_URL

// //   const { setDToken } = useContext(DoctorContext)
// //   const { setAToken } = useContext(AdminContext)

// //   const onSubmitHandler = async (event) => {
// //     event.preventDefault()

// //     if (!backendUrl) {
// //       toast.info('Set VITE_BACKEND_URL to enable admin and doctor login.')
// //       return
// //     }

// //     try {
// //       const endpoint = state === 'Admin' ? '/api/admin/login' : '/api/doctor/login'
// //       const { data } = await axios.post(backendUrl + endpoint, { email, password })
// //       if (data.success) {
// //         if (state === 'Admin') {
// //           setAToken(data.token)
// //           localStorage.setItem('aToken', data.token)
// //         } else {
// //           setDToken(data.token)
// //           localStorage.setItem('dToken', data.token)
// //         }
// //       } else {
// //         toast.error(data.message)
// //       }
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || error.message)
// //     }
// //   }

// //   return (
// //     <main className='grid min-h-screen items-center px-4 py-10 lg:grid-cols-[1fr_.9fr] lg:px-12'>
// //       <section className='hidden h-[calc(100vh-96px)] overflow-hidden rounded-[8px] bg-slate-950 lg:block'>
// //         <div className='relative h-full p-10 text-white'>
// //           <div className='absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary' />
// //           <div className='relative z-10 flex h-full flex-col justify-between'>
// //             <img className='h-64 w-full object-contain object-left  invert' src={assets.admin_logo} alt='MediSync' />
// //             <div>
// //               <p className='text-sm font-semibold uppercase tracking-[0.18em] text-teal-200'>Operations workspace</p>
// //               <h1 className='mt-3 max-w-xl text-5xl font-semibold leading-tight'>Manage doctors, bookings, and patient flow with confidence.</h1>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       <form onSubmit={onSubmitHandler} className='mx-auto w-full max-w-md rounded-[8px] border border-slate-200 bg-white p-8 shadow-xl'>
// //         <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>{state} access</p>
// //         <h2 className='mt-2 text-3xl font-semibold text-slate-950'>Sign in to MediSync</h2>
// //         <p className='mt-2 text-sm text-slate-500'>Use your {state.toLowerCase()} credentials to open the control panel.</p>

// //         <div className='mt-6 grid grid-cols-2 rounded-full bg-slate-100 p-1 text-sm font-semibold'>
// //           {['Admin', 'Doctor'].map((role) => (
// //             <button key={role} type='button' onClick={() => setState(role)} className={`rounded-full py-2 transition ${state === role ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>
// //               {role}
// //             </button>
// //           ))}
// //         </div>

// //         <div className='mt-6 space-y-4'>
// //           <label className='block text-sm font-medium text-slate-700'>
// //             Email
// //             <input onChange={(e) => setEmail(e.target.value)} value={email} className='mt-2 w-full rounded-md border border-slate-200 px-4 py-3 outline-none transition focus:border-primary' type="email" required />
// //           </label>
// //           <label className='block text-sm font-medium text-slate-700'>
// //             Password
// //             <input onChange={(e) => setPassword(e.target.value)} value={password} className='mt-2 w-full rounded-md border border-slate-200 px-4 py-3 outline-none transition focus:border-primary' type="password" required />
// //           </label>
// //         </div>

// //         <button className='mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition hover:bg-slate-950'>
// //           Login
// //         </button>
// //       </form>
// //     </main>
// //   )
// // }

// // export default Login



import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!backendUrl) {
      toast.info('Set VITE_BACKEND_URL first')
      return
    }

    try {
      const endpoint =
        state === 'Admin'
          ? '/api/admin/login'
          : '/api/doctor/login'

      const { data } = await axios.post(
        `${backendUrl}${endpoint}`,
        {
          email,
          password,
        }
      )

      if (data.success) {
        if (state === 'Admin') {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
        } else {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
        }

        toast.success(`${state} Login Successful`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message
      )
    }
  }

  return (
    <main className='grid min-h-screen bg-[#f6fbfb] lg:grid-cols-2'>

      {/* LEFT SIDE */}
      <section className='relative hidden overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#10243e] to-primary lg:flex'>

        <div className='absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl'></div>

        <div className='absolute bottom-0 right-0 h-80 w-80 rounded-full bg-teal-300/10 blur-3xl'></div>

        <div className='relative z-10 flex h-full flex-col justify-between p-14 text-white'>

          {/* LOGO */}
          <div className='flex items-center gap-4'>

            <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl'>

              <span className='text-3xl font-black text-primary'>
                M
              </span>

            </div>

            <div>
              <h1 className='text-4xl font-bold tracking-wide'>
                MediSync
              </h1>

              <p className='mt-1 text-sm uppercase tracking-[0.25em] text-cyan-100'>
                Healthcare Management
              </p>
            </div>

          </div>

          {/* CONTENT */}
          <div className='max-w-xl'>

            <p className='mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200'>
              Smart Medical Workspace
            </p>

            <h2 className='text-5xl font-bold leading-tight'>
              Manage doctors,
              appointments and patient records efficiently.
            </h2>

            <p className='mt-6 text-lg leading-8 text-slate-300'>
              A modern healthcare management platform designed for
              hospitals, clinics and medical staff with security,
              clarity and performance at its core.
            </p>

            {/* STATS */}
            <div className='mt-12 grid grid-cols-3 gap-5'>

              <div className='rounded-2xl bg-white/10 p-5 backdrop-blur-md'>
                <h3 className='text-3xl font-bold'>24K+</h3>
                <p className='mt-2 text-sm text-slate-300'>
                  Appointments
                </p>
              </div>

              <div className='rounded-2xl bg-white/10 p-5 backdrop-blur-md'>
                <h3 className='text-3xl font-bold'>150+</h3>
                <p className='mt-2 text-sm text-slate-300'>
                  Doctors
                </p>
              </div>

              <div className='rounded-2xl bg-white/10 p-5 backdrop-blur-md'>
                <h3 className='text-3xl font-bold'>99%</h3>
                <p className='mt-2 text-sm text-slate-300'>
                  Reliability
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className='flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10'>

        <form
          onSubmit={onSubmitHandler}
          className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-8 lg:p-10'
        >

          {/* TOP */}
          <div className='text-center'>

            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl font-black text-white shadow-lg'>
              M
            </div>

            <h2 className='mt-5 text-3xl font-bold text-slate-900 sm:text-4xl'>
              Welcome Back
            </h2>

            <p className='mt-2 text-slate-500'>
              Login to continue to your dashboard
            </p>

          </div>

          {/* TOGGLE */}
          <div className='mt-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1'>

            {['Admin', 'Doctor'].map((role) => (
              <button
                key={role}
                type='button'
                onClick={() => setState(role)}
                className={`rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                  state === role
                    ? 'bg-white text-primary shadow-md'
                    : 'text-slate-500'
                }`}
              >
                {role}
              </button>
            ))}

          </div>

          {/* INPUTS */}
          <div className='mt-8 space-y-5'>

            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700'>
                Email Address
              </label>

              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='admin@medisync.com'
                className='w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition-all focus:border-primary'
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700'>
                Password
              </label>

              <div className='relative'>

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  className='w-full rounded-xl border border-slate-200 px-4 py-4 pr-14 outline-none transition-all focus:border-primary'
                />

                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500'
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>

              </div>
            </div>

          </div>

          {/* BUTTON */}
          <button
            type='submit'
            className='mt-8 w-full rounded-xl bg-primary py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:opacity-90'
          >
            Login as {state}
          </button>

          <p className='mt-6 text-center text-sm text-slate-500'>
            Secure healthcare administration access.
          </p>

        </form>

      </section>

    </main>
  )
}

export default Login
