import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <section id='speciality' className='py-12 sm:py-16'>
      <div className='mb-10 text-center'>  
        <span className='inline-block rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary'>
          Specialities
        </span>
        <h2 className='mt-3 text-3xl font-bold text-slate-900 sm:text-4xl'>
          Find Care by Speciality
        </h2>
        <p className='mt-3 mx-auto max-w-xl text-sm leading-6 text-slate-500'>
          Choose the care category you need and browse verified doctors from our network.
        </p>
      </div>

      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6'>
        {specialityData.map((item) => (
          <Link
            to={`/doctors/${item.speciality}`}
            onClick={() => window.scrollTo(0, 0)}
            key={item.speciality}
            className='group flex min-h-36 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:p-5'
          >
            <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 transition-all duration-300 group-hover:from-teal-100 group-hover:to-cyan-100'>
              <img
                className='h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110'
                src={item.image}
                alt={item.speciality}
              />
            </div>
            <p className='text-xs font-semibold text-slate-700 leading-tight'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SpecialityMenu
