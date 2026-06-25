import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  return (
    <div className='space-y-5'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>Care team</p>
        <h1 className='mt-2 text-3xl font-semibold text-slate-950'>Doctors list</h1>
      </div>

      {!doctors.length ? (
        <div className='rounded-[8px] border border-slate-200 bg-white p-8 text-center text-slate-500'>No doctors found.</div>
      ) : (
        <div className='grid max-h-none grid-cols-auto gap-4 overflow-y-visible pr-0 sm:gap-5 md:max-h-[78vh] md:overflow-y-auto md:pr-1'>
          {doctors.map((item) => (
            <article className='overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary/40' key={item._id}>
              <div className='aspect-[4/3] bg-teal-50'>
                <img className='h-full w-full object-cover object-top' src={item.image} alt={item.name} />
              </div>
              <div className='space-y-3 p-4'>
                <div>
                  <p className='font-semibold text-slate-950'>{item.name}</p>
                  <p className='text-sm text-slate-500'>{item.speciality}</p>
                </div>
                <label className='flex items-center gap-2 text-sm text-slate-600'>
                  <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} className='h-4 w-4 accent-primary' />
                  Available
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorsList
