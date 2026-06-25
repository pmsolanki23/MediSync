import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContextObject'
import DoctorCard from './DoctorCard'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors, loadingDoctors } = useContext(AppContext)

  return (
    <section className='py-8 sm:py-10'>
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <span className='inline-block rounded-full bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary'>
            Top Doctors
          </span>
          <h2 className='mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl'>
            Book trusted specialists
          </h2>
          <p className='mt-2 max-w-xl text-sm leading-6 text-slate-500'>
            Carefully listed doctors with clear availability, fees, and quick booking.
          </p>
        </div>
        <button
          onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }}
          className='h-11 w-fit rounded-[8px] border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary/30 hover:text-primary hover:shadow-md'
        >
          View all doctors
        </button>
      </div>

      {loadingDoctors ? (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-4 sm:gap-5'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='h-[360px] animate-pulse overflow-hidden rounded-[8px] border border-slate-200 bg-white'>
              <div className='aspect-[4/3] bg-slate-100' />
              <div className='space-y-3 p-5'>
                <div className='h-4 w-3/4 rounded-full bg-slate-100' />
                <div className='h-3 w-1/2 rounded-full bg-slate-100' />
                <div className='h-10 rounded-[8px] bg-slate-100' />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-4 sm:gap-5 xl:grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))]'>
          {doctors.slice(0, 10).map((doctor) => (
            <DoctorCard doctor={doctor} key={doctor._id} />
          ))}
        </div>
      )}
    </section>
  )
}

export default TopDoctors
