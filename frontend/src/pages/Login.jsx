// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContextObject'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'

// const Login = () => {
//   const { backendUrl, token, setToken } = useContext(AppContext)
//   const [state, setState] = useState('Sign Up')
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const navigate = useNavigate()

//   const onSubmitHandler = async (event) => {
//     event.preventDefault()

//     if (!backendUrl) {
//       toast.info('Set VITE_BACKEND_URL to enable live account login and signup.')
//       return
//     }

//     try {
//       const endpoint = state === 'Sign Up' ? '/api/user/register' : '/api/user/login'
//       const payload = state === 'Sign Up' ? { name, email, password } : { email, password }
//       const { data } = await axios.post(backendUrl + endpoint, payload)

//       if (data.success) {
//         localStorage.setItem('token', data.token)
//         setToken(data.token)
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(() => {
//     if (token) navigate('/')
//   }, [token, navigate])

//   return (
//     <main className='flex min-h-[75vh] items-center justify-center py-10'>
//       <form onSubmit={onSubmitHandler} className='w-full max-w-md rounded-[8px] border border-slate-200 bg-white p-8 shadow-xl'>
//         <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>MediSync account</p>
//         <h1 className='mt-2 text-3xl font-semibold text-slate-950'>{state === 'Sign Up' ? 'Create Account' : 'Welcome back'}</h1>
//         <p className='mt-2 text-sm text-slate-500'>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book and manage appointments.</p>

//         <div className='mt-7 space-y-4'>
//           {state === 'Sign Up' && (
//             <label className='block text-sm font-medium text-slate-700'>
//               Full Name
//               <input onChange={(e) => setName(e.target.value)} value={name} className='mt-2 w-full rounded-md border border-slate-200 px-4 py-3 outline-none transition focus:border-primary' type="text" required />
//             </label>
//           )}
//           <label className='block text-sm font-medium text-slate-700'>
//             Email
//             <input onChange={(e) => setEmail(e.target.value)} value={email} className='mt-2 w-full rounded-md border border-slate-200 px-4 py-3 outline-none transition focus:border-primary' type="email" required />
//           </label>
//           <label className='block text-sm font-medium text-slate-700'>
//             Password
//             <input onChange={(e) => setPassword(e.target.value)} value={password} className='mt-2 w-full rounded-md border border-slate-200 px-4 py-3 outline-none transition focus:border-primary' type="password" required />
//           </label>
//         </div>

//         <button type='submit' className='mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition hover:bg-slate-950'>
//           {state === 'Sign Up' ? 'Create account' : 'Login'}
//         </button>

//         {state === 'Sign Up'
//           ? <p className='mt-5 text-sm text-slate-500'>Already have an account? <button type='button' onClick={() => setState('Login')} className='font-semibold text-primary'>Login here</button></p>
//           : <p className='mt-5 text-sm text-slate-500'>New to MediSync? <button type='button' onClick={() => setState('Sign Up')} className='font-semibold text-primary'>Create account</button></p>
//         }
//       </form>
//     </main>
//   )
// }

// export default Login



// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContextObject'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'

// const Login = () => {
//   const { backendUrl, token, setToken } =
//     useContext(AppContext)

//   const [state, setState] = useState('Sign Up')
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const navigate = useNavigate()

//   const onSubmitHandler = async (event) => {
//     event.preventDefault()

//     try {
//       const endpoint =
//         state === 'Sign Up'
//           ? '/api/user/register'
//           : '/api/user/login'

//       const payload =
//         state === 'Sign Up'
//           ? { name, email, password }
//           : { email, password }

//       const { data } = await axios.post(
//         `${backendUrl}${endpoint}`,
//         payload
//       )

//       if (data.success) {
//         localStorage.setItem('token', data.token)

//         setToken(data.token)

//         toast.success(
//           state === 'Sign Up'
//             ? 'Account Created Successfully'
//             : 'Login Successful'
//         )

//         navigate('/')
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message ||
//           error.message
//       )
//     }
//   }

//   useEffect(() => {
//     if (token) {
//       navigate('/')
//     }
//   }, [token])

//   return (
//     <main className='flex min-h-[80vh] items-center justify-center bg-[#f6fbfb] px-4'>

//       <form
//         onSubmit={onSubmitHandler}
//         className='w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-xl'
//       >

//         <div className='text-center'>

//           <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl font-black text-white'>
//             M
//           </div>

//           <h1 className='mt-5 text-4xl font-bold text-slate-900'>
//             {state === 'Sign Up'
//               ? 'Create Account'
//               : 'Welcome Back'}
//           </h1>

//           <p className='mt-2 text-slate-500'>
//             {state === 'Sign Up'
//               ? 'Create your MediSync account'
//               : 'Login to continue'}
//           </p>
//         </div>

//         <div className='mt-8 space-y-5'>

//           {state === 'Sign Up' && (
//             <div>
//               <label className='mb-2 block text-sm font-medium text-slate-700'>
//                 Full Name
//               </label>

//               <input
//                 type='text'
//                 required
//                 value={name}
//                 onChange={(e) =>
//                   setName(e.target.value)
//                 }
//                 placeholder='John Doe'
//                 className='w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-primary'
//               />
//             </div>
//           )}

//           <div>
//             <label className='mb-2 block text-sm font-medium text-slate-700'>
//               Email Address
//             </label>

//             <input
//               type='email'
//               required
//               value={email}
//               onChange={(e) =>
//                 setEmail(e.target.value)
//               }
//               placeholder='john@example.com'
//               className='w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-primary'
//             />
//           </div>

//           <div>
//             <label className='mb-2 block text-sm font-medium text-slate-700'>
//               Password
//             </label>

//             <input
//               type='password'
//               required
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               placeholder='••••••••'
//               className='w-full rounded-xl border border-slate-200 px-4 py-4 outline-none focus:border-primary'
//             />
//           </div>

//         </div>

//         <button
//           type='submit'
//           className='mt-8 w-full rounded-xl bg-primary py-4 text-sm font-bold text-white transition hover:opacity-90'
//         >
//           {state === 'Sign Up'
//             ? 'Create Account'
//             : 'Login'}
//         </button>

//         <p className='mt-6 text-center text-sm text-slate-500'>

//           {state === 'Sign Up'
//             ? 'Already have an account?'
//             : "Don't have an account?"}

//           <button
//             type='button'
//             onClick={() =>
//               setState(
//                 state === 'Sign Up'
//                   ? 'Login'
//                   : 'Sign Up'
//               )
//             }
//             className='ml-2 font-semibold text-primary'
//           >
//             {state === 'Sign Up'
//               ? 'Login'
//               : 'Sign Up'}
//           </button>

//         </p>

//       </form>

//     </main>
//   )
// }

// export default Login


import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContextObject'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { backendUrl, token, setToken } =
    useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)

      const endpoint =
        state === 'Sign Up'
          ? '/api/user/register'
          : '/api/user/login'

      const payload =
        state === 'Sign Up'
          ? { name, email, password }
          : { email, password }

      const { data } = await axios.post(
        `${backendUrl}${endpoint}`,
        payload
      )

      if (data.success) {
        localStorage.setItem('token', data.token)

        setToken(data.token)

        toast.success(
          state === 'Sign Up'
            ? 'Account Created Successfully'
            : 'Login Successful'
        )

        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <main className='grid min-h-[calc(100vh-72px)] bg-[#f6fbfb] lg:grid-cols-2'>

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
                Healthcare Platform
              </p>
            </div>

          </div>

          {/* CONTENT */}
          <div className='max-w-xl'>

            <p className='mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200'>
              Smart Healthcare Experience
            </p>

            <h2 className='text-5xl font-bold leading-tight'>
              Book appointments,
              manage records and connect with trusted doctors.
            </h2>

            <p className='mt-6 text-lg leading-8 text-slate-300'>
              A modern healthcare platform designed for patients to
              access appointments, doctors and medical services
              with simplicity, speed and security.
            </p>

            {/* STATS */}
            <div className='mt-12 grid grid-cols-3 gap-5'>

              <div className='rounded-2xl bg-white/10 p-5 backdrop-blur-md'>
                <h3 className='text-3xl font-bold'>24K+</h3>
                <p className='mt-2 text-sm text-slate-300'>
                  Happy Patients
                </p>
              </div>

              <div className='rounded-2xl bg-white/10 p-5 backdrop-blur-md'>
                <h3 className='text-3xl font-bold'>150+</h3>
                <p className='mt-2 text-sm text-slate-300'>
                  Expert Doctors
                </p>
              </div>

              <div className='rounded-2xl bg-white/10 p-5 backdrop-blur-md'>
                <h3 className='text-3xl font-bold'>99%</h3>
                <p className='mt-2 text-sm text-slate-300'>
                  Secure Access
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

            <h1 className='mt-5 text-3xl font-bold text-slate-900 sm:text-4xl'>
              {state === 'Sign Up'
                ? 'Create Account'
                : 'Welcome Back'}
            </h1>

            <p className='mt-2 text-slate-500'>
              {state === 'Sign Up'
                ? 'Create your MediSync account'
                : 'Login to continue'}
            </p>

          </div>

          {/* TOGGLE */}
          <div className='mt-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1'>

            {['Sign Up', 'Login'].map((item) => (
              <button
                key={item}
                type='button'
                onClick={() => setState(item)}
                className={`rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                  state === item
                    ? 'bg-white text-primary shadow-md'
                    : 'text-slate-500'
                }`}
              >
                {item}
              </button>
            ))}

          </div>

          {/* INPUTS */}
          <div className='mt-8 space-y-5'>

            {state === 'Sign Up' && (
              <div>

                <label className='mb-2 block text-sm font-medium text-slate-700'>
                  Full Name
                </label>

                <input
                  type='text'
                  required
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder='John Doe'
                  className='w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition-all focus:border-primary'
                />

              </div>
            )}

            <div>

              <label className='mb-2 block text-sm font-medium text-slate-700'>
                Email Address
              </label>

              <input
                type='email'
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder='john@example.com'
                className='w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition-all focus:border-primary'
              />

            </div>

            <div>

              <label className='mb-2 block text-sm font-medium text-slate-700'>
                Password
              </label>

              <input
                type='password'
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder='••••••••'
                className='w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition-all focus:border-primary'
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            type='submit'
            disabled={loading}
            className='mt-8 w-full rounded-xl bg-primary py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:opacity-90 disabled:opacity-70'
          >
            {loading
              ? 'Please Wait...'
              : state === 'Sign Up'
              ? 'Create Account'
              : 'Login'}
          </button>

          {/* FOOTER */}
          <p className='mt-6 text-center text-sm text-slate-500'>

            {state === 'Sign Up'
              ? 'Already have an account?'
              : "Don't have an account?"}

            <button
              type='button'
              onClick={() =>
                setState(
                  state === 'Sign Up'
                    ? 'Login'
                    : 'Sign Up'
                )
              }
              className='ml-2 font-semibold text-primary hover:underline'
            >
              {state === 'Sign Up'
                ? 'Login'
                : 'Sign Up'}
            </button>

          </p>

        </form>

      </section>

    </main>
  )
}

export default Login
