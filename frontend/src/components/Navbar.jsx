
import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContextObject'

const navItems = [
  ['/', 'Home'],
  ['/doctors', 'Doctors'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [showMenu, setShowMenu] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { token, setToken, userData } = useContext(AppContext)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setShowMenu(false)
  }, [location.pathname])

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setShowLogoutPopup(false)
    navigate('/login')
  }

  // GET USER INITIALS
  const getInitials = (name) => {
    if (!name) return 'U'

    return name
      .split(' ')
      .map((word) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  // CHECK IMAGE
  const hasValidImage =
    userData?.image &&
    userData.image.trim() !== '' &&
    !userData.image.includes('profile_pic')

  // NAV ACTIVE CLASS
  const linkClass = ({ isActive }) =>
    `relative rounded-full px-4 lg:px-5 py-2 text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-primary text-white shadow-md'
        : 'text-slate-600 hover:bg-teal-50 hover:text-primary'
    }`

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <header
        className={`sticky top-0 z-50 border-b border-slate-200 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 shadow-lg backdrop-blur-xl'
            : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        <div className='mx-auto flex h-[72px] w-full max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10'>
          
          {/* LOGO */}
          <button
            onClick={() => navigate('/')}
            className='flex items-center'
          >
            <img
              src={assets.logo}
              alt='MediSync'
              className='h-10 w-32 object-contain sm:h-11 sm:w-36'
            />
          </button>

          {/* DESKTOP NAV */}
          <nav className='hidden items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm md:flex'>
            {navItems.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={linkClass}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className='flex items-center gap-2 sm:gap-3'>
            
            {/* LOGGED USER */}
            {token && userData ? (
              <div className='group relative'>
                
                {/* PROFILE BUTTON */}
                <button className='flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md sm:px-3'>
                  
                  {/* PROFILE IMAGE / INITIALS */}
                  {hasValidImage ? (
                    <img
                      src={userData.image}
                      alt={userData.name}
                      className='h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10'
                    />
                  ) : (
                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold uppercase text-white sm:h-10 sm:w-10 sm:text-sm'>
                      {getInitials(userData?.name)}
                    </div>
                  )}

                  {/* USER NAME */}
                  <div className='hidden text-left lg:block'>
                    <p className='max-w-[120px] truncate text-sm font-semibold text-slate-800'>
                      {userData?.name}
                    </p>
                  </div>

                  {/* DROPDOWN ICON */}
                  <img
                    src={assets.dropdown_icon}
                    alt=''
                    className='hidden w-2.5 sm:block'
                  />
                </button>

                {/* DROPDOWN */}
                <div className='absolute right-0 top-16 hidden w-60 group-hover:block'>
                  <div className='rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl'>
                    
                    {/* USER INFO */}
                    <div className='mb-2 border-b border-slate-100 pb-3'>
                      <p className='text-sm font-semibold text-slate-900'>
                        {userData?.name}
                      </p>

                      <p className='truncate text-xs text-slate-500'>
                        {userData?.email}
                      </p>
                    </div>

                    {/* PROFILE */}
                    <button
                      onClick={() => navigate('/my-profile')}
                      className='w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-teal-50'
                    >
                      My Profile
                    </button>

                    {/* APPOINTMENTS */}
                    <button
                      onClick={() => navigate('/my-appointments')}
                      className='w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-teal-50'
                    >
                      My Appointments
                    </button>

                    {/* MESSAGES */}
                    <button
                      onClick={() => navigate('/messages')}
                      className='w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-teal-50'
                    >
                      💬 Messages
                    </button>

                    {/* NOTIFICATIONS */}
                    <button
                      onClick={() => navigate('/notifications')}
                      className='w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-teal-50'
                    >
                      🔔 Notifications
                    </button>

                    {/* INVOICES */}
                    <button
                      onClick={() => navigate('/invoices')}
                      className='w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-teal-50'
                    >
                      📄 Invoices
                    </button>

                    {/* PRESCRIPTIONS */}
                    <button
                      onClick={() => navigate('/prescriptions')}
                      className='w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-teal-50'
                    >
                      💊 Prescriptions
                    </button>

                    {/* LOGOUT */}
                    <button
                      onClick={() => setShowLogoutPopup(true)}
                      className='w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50'
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className='hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-slate-950 md:block'
              >
                Create Account
              </button>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setShowMenu(true)}
              className='flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm md:hidden'
            >
              <img
                src={assets.menu_icon}
                alt='Menu'
                className='h-5 w-5'
              />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}

      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          showMenu ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* OVERLAY */}
        <div
          onClick={() => setShowMenu(false)}
          className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        />

        {/* SIDEBAR */}
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
            showMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* TOP */}
          <div className='flex items-center justify-between border-b border-slate-200 px-5 py-5'>
            <img
              src={assets.logo}
              alt='MediSync'
              className='h-10 w-32 object-contain'
            />

            <button
              onClick={() => setShowMenu(false)}
              className='rounded-full border border-slate-200 p-2'
            >
              <img
                src={assets.cross_icon}
                alt='Close'
                className='h-4 w-4'
              />
            </button>
          </div>

          {/* USER INFO */}
          {token && userData && (
            <div className='border-b border-slate-100 px-5 py-5'>
              <div className='flex items-center gap-3'>
                
                {hasValidImage ? (
                  <img
                    src={userData.image}
                    alt={userData.name}
                    className='h-12 w-12 rounded-full object-cover'
                  />
                ) : (
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold uppercase text-white'>
                    {getInitials(userData?.name)}
                  </div>
                )}

                <div className='min-w-0'>
                  <p className='truncate font-semibold text-slate-900'>
                    {userData?.name}
                  </p>

                  <p className='truncate text-xs text-slate-500'>
                    {userData?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NAV LINKS */}
          <nav className='flex flex-col gap-2 px-5 py-6'>
            {navItems.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* BOTTOM BUTTONS */}
          <div className='absolute bottom-6 left-5 right-5 flex flex-col gap-3'>
            
            {token ? (
              <>
                <button
                  onClick={() => {
                    navigate('/my-appointments')
                    setShowMenu(false)
                  }}
                  className='rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200'
                >
                  My Appointments
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowLogoutPopup(true)
                  }}
                  className='rounded-2xl bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100'
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate('/login')
                  setShowMenu(false)
                }}
                className='rounded-2xl bg-primary py-3 text-sm font-semibold text-white'
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= LOGOUT POPUP ================= */}

      {showLogoutPopup && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'>
          
          <div className='w-full max-w-md rounded-[30px] bg-white p-6 shadow-2xl sm:p-8'>
            
            {/* ICON */}
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 text-red-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 16l4-4m0 0l-4-4m4 4H7'
                />
              </svg>
            </div>

            {/* TITLE */}
            <h2 className='mt-6 text-center text-2xl font-bold text-slate-900'>
              Logout Account?
            </h2>

            {/* DESCRIPTION */}
            <p className='mt-3 text-center text-sm leading-7 text-slate-500 sm:text-base'>
              Are you sure you want to logout from your MediSync account?
            </p>

            {/* BUTTONS */}
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              
              <button
                onClick={() => setShowLogoutPopup(false)}
                className='flex-1 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50'
              >
                Cancel
              </button>

              <button
                onClick={logout}
                className='flex-1 rounded-2xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar 