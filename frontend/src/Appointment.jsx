import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from './context/AppContextObject'
import { assets } from './assets/assets'
import RelatedDoctors from './components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  useEffect(() => {
    const doc = doctors.find((doctor) => doctor._id === docId)
    setDocInfo(doc ? { ...doc, slots_booked: doc.slots_booked || {} } : null)
  }, [doctors, docId])

  useEffect(() => {
    if (!docInfo) return

    const slots = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (today.toDateString() === currentDate.toDateString()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }

      const timeSlots = []
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`
        const isSlotAvailable = !docInfo.slots_booked[slotDate] || !docInfo.slots_booked[slotDate].includes(formattedTime)

        if (isSlotAvailable) {
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      slots.push(timeSlots)
    }

    setDocSlots(slots)
    setSlotIndex(0)
    setSlotTime('')
  }, [docInfo])

  const bookAppointment = async () => {
    if (!slotTime) {
      toast.warning('Please select a time slot')
      return
    }

    if (!token) {
      toast.warning('Login to book appointment')
      return navigate('/login')
    }

    if (!backendUrl) {
      toast.info('Connect the backend URL to complete live bookings.')
      return
    }

    const date = docSlots[slotIndex][0].datetime
    const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

    try {
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!docInfo) {
    return (
      <div className='my-8 rounded-[8px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm'>
        Doctor not found.
      </div>
    )
  }

  const selectedDay = docSlots[slotIndex]?.[0]?.datetime
  const selectedDateText = selectedDay
    ? `${daysOfWeek[selectedDay.getDay()]} ${selectedDay.getDate()}`
    : 'Select date'

  return (
    <main className='py-5 sm:py-8'>
      <section className='overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm'>
        <div className='grid lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]'>
          <div className='relative min-h-[300px] bg-gradient-to-br from-slate-100 via-cyan-50 to-emerald-50 sm:min-h-[440px] lg:min-h-full'>
            <img
              className='absolute inset-0 h-full w-full object-cover object-top'
              src={docInfo.image}
              alt={docInfo.name}
            />
            <div className='absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/55 to-transparent' />
            <div className='absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur-sm'>
              {docInfo.available === false ? 'Offline' : 'Available'}
            </div>
          </div>

          <div className='p-5 sm:p-8 lg:p-10'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div className='min-w-0'>
                <p className='text-xs font-bold uppercase tracking-[0.2em] text-primary'>{docInfo.speciality}</p>
                <h1 className='mt-3 flex flex-wrap items-center gap-2 text-2xl font-bold leading-tight text-slate-950 sm:text-4xl'>
                  <span className='min-w-0 break-words'>{docInfo.name}</span>
                  <img className='h-5 w-5 shrink-0' src={assets.verified_icon} alt='Verified' />
                </h1>
                <p className='mt-3 text-sm font-medium leading-6 text-slate-500 sm:text-base'>
                  {docInfo.degree} | {docInfo.experience || 'Experienced specialist'}
                </p>
              </div>

              <div className='w-fit rounded-[8px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700'>
                <p className='text-xs font-bold uppercase tracking-[0.14em]'>Consultation</p>
                <p className='mt-1 text-xl font-bold text-slate-950'>{currencySymbol} {docInfo.fees}</p>
              </div>
            </div>

            <div className='mt-8 grid gap-3 sm:grid-cols-3'>
              <div className='rounded-[8px] border border-slate-200 bg-slate-50 p-4'>
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>Status</p>
                <p className='mt-2 text-lg font-bold text-slate-950'>{docInfo.available === false ? 'Offline' : 'Available today'}</p>
              </div>
              <div className='rounded-[8px] border border-slate-200 bg-slate-50 p-4'>
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>Slot duration</p>
                <p className='mt-2 text-lg font-bold text-slate-950'>30 minutes</p>
              </div>
              <div className='rounded-[8px] border border-slate-200 bg-slate-50 p-4'>
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>Selected</p>
                <p className='mt-2 truncate text-lg font-bold text-slate-950'>{slotTime ? `${selectedDateText}, ${slotTime}` : 'None'}</p>
              </div>
            </div>

            <div className='mt-8'>
              <p className='mb-3 flex items-center gap-2 text-sm font-bold text-slate-950'>
                About doctor <img className='h-4 w-4' src={assets.info_icon} alt='' />
              </p>
              <p className='max-w-4xl text-sm leading-7 text-slate-500 sm:text-base'>{docInfo.about}</p>
            </div>
          </div>
        </div>
      </section>

      <section className='mt-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:mt-8 sm:p-8'>
        <div className='mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-primary'>Booking slots</p>
            <h2 className='mt-2 text-2xl font-bold text-slate-950'>Choose date and time</h2>
          </div>
          <p className='text-sm font-medium text-slate-500'>Slots are shown in your local time.</p>
        </div>

        <div className='flex gap-3 overflow-x-auto pb-2'>
          {docSlots.map((item, index) => {
            const date = item[0]?.datetime
            return (
              <button
                type='button'
                onClick={() => { setSlotIndex(index); setSlotTime('') }}
                key={index}
                className={`grid h-20 min-w-20 place-items-center rounded-[8px] border px-4 text-center text-sm font-bold transition ${
                  slotIndex === index
                    ? 'border-primary bg-primary text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/40 hover:bg-white'
                }`}
              >
                <span>{date && daysOfWeek[date.getDay()]}</span>
                <span className='text-xl'>{date && date.getDate()}</span>
              </button>
            )
          })}
        </div>

        <div className='mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,104px),1fr))] gap-3'>
          {docSlots[slotIndex]?.map((item) => (
            <button
              type='button'
              onClick={() => setSlotTime(item.time)}
              key={item.time}
              className={`h-11 rounded-[8px] border px-3 text-sm font-semibold transition ${
                item.time === slotTime
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary'
              }`}
            >
              {item.time.toLowerCase()}
            </button>
          ))}
        </div>

        <div className='mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-slate-500'>
            {slotTime ? `Ready to book ${selectedDateText} at ${slotTime}.` : 'Select one available slot to continue.'}
          </p>
          <button
            onClick={bookAppointment}
            className='h-12 rounded-[8px] bg-primary px-8 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 sm:min-w-56'
          >
            Book appointment
          </button>
        </div>
      </section>

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </main>
  )
}

export default Appointment
