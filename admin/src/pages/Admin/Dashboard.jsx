import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import MetricCard from '../../components/MetricCard'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) getDashData()
  }, [aToken])

  if (!dashData) {
    return <div className='rounded-[8px] border border-slate-200 bg-white p-8 text-center text-slate-500'>Loading dashboard...</div>
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>Admin overview</p>
        <h1 className='mt-2 text-3xl font-semibold text-slate-950'>Dashboard</h1>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        <MetricCard icon={assets.doctor_icon} label='Doctors' value={dashData.doctors} />
        <MetricCard icon={assets.appointments_icon} label='Appointments' value={dashData.appointments} />
        <MetricCard icon={assets.patients_icon} label='Patients' value={dashData.patients} />
      </div>

      <section className='overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm'>
        <div className='flex items-center gap-3 border-b border-slate-200 px-5 py-4'>
          <img className='h-5 w-5' src={assets.list_icon} alt="" />
          <p className='font-semibold text-slate-950'>Latest bookings</p>
        </div>
        <div className='divide-y divide-slate-100'>
          {!dashData.latestAppointments?.length && <p className='p-6 text-sm text-slate-500'>No bookings yet.</p>}
          {dashData.latestAppointments?.slice(0, 5).map((item) => (
            <div className='flex items-start gap-3 px-4 py-4 hover:bg-teal-50/40 sm:items-center sm:px-5' key={item._id}>
              <img className='h-11 w-11 rounded-full object-cover' src={item.docData.image} alt="" />
              <div className='min-w-0 flex-1 text-sm'>
                <p className='truncate font-semibold text-slate-950'>{item.docData.name}</p>
                <p className='break-words text-slate-500'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? <p className='text-xs font-semibold text-red-500'>Cancelled</p> : item.isCompleted ? <p className='text-xs font-semibold text-green-600'>Completed</p> : <button onClick={() => cancelAppointment(item._id)}><img className='h-9 w-9' src={assets.cancel_icon} alt="Cancel" /></button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
