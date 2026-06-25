import React, { useContext, useMemo } from 'react'
import { AppContext } from '../context/AppContextObject'
import DoctorCard from './DoctorCard'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)

  const relDoc = useMemo(() => (
    doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId).slice(0, 4)
  ), [doctors, speciality, docId])

  if (!relDoc.length) return null

  return (
    <section className='my-8 sm:my-12 lg:my-16'>
      <div className='mb-5 sm:mb-6 lg:mb-8 flex flex-col gap-1.5 sm:gap-2 lg:gap-3'>
        <p className='text-xs font-bold uppercase tracking-[0.2em] text-primary'>Related care</p>
        <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-slate-950'>More {speciality} doctors</h2>
        <p className='max-w-2xl text-xs sm:text-sm lg:text-base leading-5 sm:leading-6 text-slate-500'>
          Explore similar specialists if you want another time slot or profile match.
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5'>
        {relDoc.map((doctor) => <DoctorCard doctor={doctor} key={doctor._id} />)}
      </div>
    </section>
  )
}

export default RelatedDoctors
