import React from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate()
  const isAvailable = doctor.available !== false

  return (
    <button
      type='button'
      onClick={() => {
        navigate(`/appointment/${doctor._id}`)
        window.scrollTo(0, 0)
      }}
      className='group flex h-full min-h-[320px] sm:min-h-[360px] flex-col overflow-hidden rounded-lg sm:rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation'
    >
      <div className='relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-emerald-50'>
        <img
          className='h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105'
          src={doctor.image}
          alt={doctor.name}
        />
        <div className='absolute inset-x-0 bottom-0 h-12 sm:h-16 bg-gradient-to-t from-slate-950/40 to-transparent' />
        <div className={`absolute left-2 sm:left-3 top-2 sm:top-3 flex items-center gap-1.5 rounded-full px-2 sm:px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm ${
          isAvailable
            ? 'bg-emerald-500/90 text-white'
            : 'bg-slate-500/80 text-white'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? 'bg-white' : 'bg-slate-300'}`} />
          <span className='hidden sm:inline'>{isAvailable ? 'Available' : 'Unavailable'}</span>
          <span className='sm:hidden'>{isAvailable ? 'On' : 'Off'}</span>
        </div>
        {doctor.fees && (
          <div className='absolute bottom-2 sm:bottom-3 right-2 sm:right-3 rounded-full bg-white/95 px-2 sm:px-3 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm'>
            ₹{doctor.fees}
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col p-3 sm:p-4 lg:p-5'>
        <div className='min-w-0'>
          <p className='truncate text-base sm:text-lg font-bold text-slate-950'>{doctor.name}</p>
          <p className='mt-0.5 sm:mt-1 truncate text-xs sm:text-sm font-medium text-primary'>{doctor.speciality}</p>
          <p className='mt-1 sm:mt-2 line-clamp-2 min-h-8 sm:min-h-10 text-xs sm:text-sm leading-5 text-slate-500'>
            {doctor.degree || doctor.about || 'Experienced medical specialist for planned care.'}
          </p>
        </div>

        <div className='mt-auto pt-3 sm:pt-5'>
          <div className='mb-3 sm:mb-4 flex flex-wrap items-center gap-1.5 sm:gap-2'>
            <span className='rounded-full bg-slate-100 px-2 sm:px-3 py-1 text-xs font-semibold text-slate-600'>
              {doctor.experience || '2+ Yrs'}
            </span>
            <span className='rounded-full bg-cyan-50 px-2 sm:px-3 py-1 text-xs font-semibold text-cyan-700'>
              30 min
            </span>
          </div>

          <span className='flex h-10 sm:h-11 w-full items-center justify-center rounded-lg sm:rounded-2xl bg-slate-950 text-xs sm:text-sm font-semibold text-white transition group-hover:bg-primary touch-manipulation'>
            View profile
          </span>
        </div>
      </div>
    </button>
  )
}

export default DoctorCard
