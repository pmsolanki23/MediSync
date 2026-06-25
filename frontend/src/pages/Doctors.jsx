import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContextObject'
import DoctorCard from '../components/DoctorCard'
import { specialityData } from '../assets/assets'

const Doctors = () => {
  const { speciality } = useParams()
  const [showFilter, setShowFilter] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { doctors, loadingDoctors } = useContext(AppContext)

  const filterDoc = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSpeciality = speciality ? doc.speciality === speciality : true
      const searchText = `${doc.name} ${doc.speciality} ${doc.degree}`.toLowerCase()
      return matchesSpeciality && searchText.includes(query.toLowerCase())
    })
  }, [doctors, speciality, query])

  useEffect(() => {
    setShowFilter(false)
  }, [speciality])

  return (
    <main className='py-5 sm:py-8'>
      <section className='relative mb-6 overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm sm:mb-8'>
        <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500' />
        <div className='grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.22em] text-primary'>Doctor directory</p>
            <h1 className='mt-3 text-2xl font-bold leading-tight text-slate-950 sm:text-4xl'>
              Find the right specialist
            </h1>
            <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base'>
              Search trusted doctors by speciality, name, or qualification and book a focused consultation slot.
            </p>

            <div className='mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600'>
              <span className='rounded-full bg-slate-100 px-3 py-1.5'>{doctors.length} doctors</span>
              <span className='rounded-full bg-cyan-50 px-3 py-1.5 text-cyan-700'>Verified profiles</span>
              <span className='rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700'>Online booking</span>
            </div>
          </div>

          <div className='rounded-[8px] border border-slate-200 bg-slate-50 p-3'>
            <label className='mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500'>
              Search doctors
            </label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className='h-12 w-full rounded-[8px] border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10'
              placeholder='Name, speciality, degree...'
              type='search'
            />
          </div>
        </div>
      </section>

      <div className='flex flex-col gap-5 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex h-11 items-center justify-center rounded-[8px] border px-5 text-sm font-semibold transition lg:hidden ${
            showFilter ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          {showFilter ? 'Hide filters' : 'Show filters'}
        </button>

        <aside className={`w-full shrink-0 rounded-[8px] border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24 lg:block ${showFilter ? 'block' : 'hidden'}`}>
          <div className='mb-3 border-b border-slate-100 px-2 pb-3'>
            <p className='text-sm font-bold text-slate-950'>Specialities</p>
            <p className='mt-1 text-xs text-slate-500'>Choose a department</p>
          </div>

          <button
            onClick={() => navigate('/doctors')}
            className={`mb-1 flex w-full items-center justify-between rounded-[8px] px-3 py-3 text-left text-sm font-semibold transition ${
              !speciality ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            All specialities
            <span className={`rounded-full px-2 py-0.5 text-xs ${!speciality ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {doctors.length}
            </span>
          </button>

          {specialityData.map((item) => (
            <button
              key={item.speciality}
              onClick={() => navigate(speciality === item.speciality ? '/doctors' : `/doctors/${item.speciality}`)}
              className={`mb-1 flex w-full items-center gap-3 rounded-[8px] px-3 py-3 text-left text-sm font-semibold transition ${
                speciality === item.speciality
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <img className='h-8 w-8 rounded-full bg-white p-1 ring-1 ring-slate-100' src={item.image} alt='' />
              <span className='min-w-0 truncate'>{item.speciality}</span>
            </button>
          ))}
        </aside>

        <section className='min-h-80 flex-1'>
          <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-sm font-semibold text-slate-600'>
              Showing <span className='text-slate-950'>{filterDoc.length}</span> doctor{filterDoc.length === 1 ? '' : 's'}
            </p>
            {speciality && (
              <button
                onClick={() => navigate('/doctors')}
                className='w-fit rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary'
              >
                Clear speciality
              </button>
            )}
          </div>

          {loadingDoctors ? (
            <div className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-4 sm:gap-5'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='h-[360px] animate-pulse rounded-[8px] border border-slate-200 bg-white'>
                  <div className='h-44 bg-slate-100' />
                  <div className='space-y-3 p-5'>
                    <div className='h-4 w-3/4 rounded-full bg-slate-100' />
                    <div className='h-3 w-1/2 rounded-full bg-slate-100' />
                    <div className='h-10 rounded-[8px] bg-slate-100' />
                  </div>
                </div>
              ))}
            </div>
          ) : filterDoc.length ? (
            <div className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-4 sm:gap-5 xl:grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))]'>
              {filterDoc.map((doctor) => <DoctorCard doctor={doctor} key={doctor._id} />)}
            </div>
          ) : (
            <div className='rounded-[8px] border border-slate-200 bg-white p-8 text-center shadow-sm'>
              <h2 className='text-lg font-bold text-slate-950'>No doctors found</h2>
              <p className='mt-2 text-sm text-slate-500'>Try another speciality or search term.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default Doctors
