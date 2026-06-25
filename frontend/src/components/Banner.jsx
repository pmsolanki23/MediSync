import React from 'react'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <section className='my-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-teal-700 to-slate-800 text-white sm:my-16 sm:rounded-3xl'>
      <div className='relative'>
        {/* Decorations */}
        <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-2xl' />
        <div className='absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-teal-300/10 blur-2xl' />

        <div className='relative z-10 grid items-center gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_auto] lg:px-12'>
          <div className='max-w-xl'>
            <span className='inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm'>
              Patient Account
            </span>
            <h2 className='mt-4 text-3xl font-bold leading-tight sm:text-4xl'>
              Manage all your appointments in one place
            </h2>
            <p className='mt-4 text-base leading-7 text-white/70'>
              Create a free account to book faster, track appointment status, manage payments, and keep your health history organized.
            </p>
            <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
              <button
                onClick={() => { navigate('/login'); window.scrollTo(0, 0) }}
                className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:px-7'
              >
                Create Free Account
              </button>
              <button
                onClick={() => navigate('/doctors')}
                className='rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:px-7'
              >
                Browse Doctors
              </button>
            </div>
          </div>

          {/* Feature list */}
          <div className='hidden space-y-3 lg:block'>
            {[
              'Book appointments instantly',
              'Track appointment status',
              'Secure online payments',
              'Manage your health profile',
            ].map((feature) => (
              <div key={feature} className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-sm'>
                <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/20'>
                  <svg className='h-3.5 w-3.5 text-emerald-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <span className='text-sm font-medium text-white/90'>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
