import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  return (
    <div className='space-y-5'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>Operations</p>
        <h1 className='mt-2 text-3xl font-semibold text-slate-950'>All appointments</h1>
      </div>

      <section className='overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm'>
        <div className='hidden grid-cols-[.4fr_2fr_.8fr_2fr_2fr_.8fr_1fr] gap-3 border-b border-slate-200 px-5 py-4 text-xs font-semibold uppercase text-slate-500 md:grid'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        <div className='max-h-[75vh] divide-y divide-slate-100 overflow-y-auto'>
          {!appointments.length && <p className='p-6 text-sm text-slate-500'>No appointments found.</p>}
          {appointments.map((item, index) => (
            <div className='grid gap-3 px-4 py-4 text-sm text-slate-600 hover:bg-teal-50/40 md:grid-cols-[.4fr_2fr_.8fr_2fr_2fr_.8fr_1fr] md:items-center md:px-5' key={item._id || index}>
              <p className='hidden md:block'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} className='h-9 w-9 rounded-full object-cover' alt="" />
                <p className='min-w-0 break-words font-medium text-slate-950'>{item.userData.name}</p>
              </div>
              <p className='hidden md:block'>{calculateAge(item.userData.dob)}</p>
              <p><span className='font-semibold text-slate-900 md:hidden'>Date: </span>{slotDateFormat(item.slotDate)} {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img src={item.docData.image} className='h-9 w-9 rounded-full bg-teal-50 object-cover' alt="" />
                <p className='min-w-0 break-words'><span className='font-semibold text-slate-900 md:hidden'>Doctor: </span>{item.docData.name}</p>
              </div>
              <p><span className='font-semibold text-slate-900 md:hidden'>Fees: </span>{currency}{item.amount}</p>
              {item.cancelled ? <p className='text-xs font-semibold text-red-500'>Cancelled</p>
                : item.isCompleted ? <p className='text-xs font-semibold text-green-600'>Completed</p> :
                  <button onClick={() => cancelAppointment(item._id)} className='w-fit'><img className='h-9 w-9' src={assets.cancel_icon} alt="Cancel" /></button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AllAppointments
