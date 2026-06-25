import React from 'react'

const MetricCard = ({ icon, label, value }) => {
  return (
    <div className='rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40'>
      <div className='flex items-center gap-4'>
        <div className='flex h-14 w-14 items-center justify-center rounded-[8px] bg-teal-50'>
          <img className='h-8 w-8 object-contain' src={icon} alt='' />
        </div>
        <div className='min-w-0'>
          <p className='break-words text-2xl font-semibold text-slate-950'>{value}</p>
          <p className='text-sm text-slate-500'>{label}</p>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
