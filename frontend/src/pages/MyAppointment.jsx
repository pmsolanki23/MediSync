
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContextObject'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { Download, RotateCw, CheckCircle, XCircle } from 'lucide-react'

const MyAppointments = () => {
  const {
    backendUrl,
    token,
    getDoctorsData,
  } = useContext(AppContext)

  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [payment, setPayment] = useState('')
  const [payingAppointment, setPayingAppointment] = useState('')
  const [rescheduleModal, setRescheduleModal] = useState(false)
  const [selectedForReschedule, setSelectedForReschedule] = useState(null)
  const [newSlotDate, setNewSlotDate] = useState('')
  const [newSlotTime, setNewSlotTime] = useState('')

  const months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const slotDateFormat = (slotDate) => {
    const [day, month, year] =
      slotDate.split('_')

    return `${day} ${
      months[Number(month)]
    } ${year}`
  }

  // GET USER APPOINTMENTS
  const getUserAppointments = useCallback(
    async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/user/appointments`,
          {
            headers: { token },
          }
        )

        if (data.success) {
          setAppointments(
            data.appointments.reverse()
          )
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error.message
        )
      }
    },
    [backendUrl, token]
  )

  // CANCEL APPOINTMENT
  const cancelAppointment = async (
    appointmentId
  ) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        {
          headers: { token },
        }
      )

      if (data.success) {
        toast.success(data.message)

        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message
      )
    }
  }

  // RAZORPAY
  const initPay = (order, key) => {
    if (!window.Razorpay) {
      toast.error('Razorpay checkout is still loading. Please try again.')
      return
    }

    if (!key) {
      toast.error('Razorpay key is missing on the server.')
      return
    }

    const options = {
      key,

      amount: order.amount,
      currency: order.currency,

      name: 'MediSync',
      description:
        'Appointment Payment',

      order_id: order.id,

      handler: async (response) => {
        try {
          const { data } =
            await axios.post(
              `${backendUrl}/api/user/verifyRazorpay`,
              response,
              {
                headers: { token },
              }
            )

          if (data.success) {
            toast.success(
              'Payment Successful'
            )

            setPayment('')
            setPayingAppointment('')
            getUserAppointments()

            navigate('/my-appointments')
          } else {
            setPayingAppointment('')
            toast.error(data.message)
          }
        } catch (error) {

          toast.error(
            error?.response?.data?.message ||
              error.message
          )
        }
      },
      modal: {
        ondismiss: () => {
          setPayingAppointment('')
        },
      },
    }

    const rzp =
      new window.Razorpay(options)

    rzp.on('payment.failed', (response) => {
      setPayingAppointment('')
      toast.error(response?.error?.description || 'Payment failed')
    })

    rzp.open()
  }

  // PAYMENT
  const appointmentRazorpay = async (
    appointmentId
  ) => {
    try {
      setPayingAppointment(appointmentId)

      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        {
          headers: { token },
        }
      )

      if (data.success) {
        if (data.demo) {
          const verifyResponse = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            {
              demo: true,
              appointmentId,
            },
            {
              headers: { token },
            }
          )

          if (verifyResponse.data.success) {
            toast.success(verifyResponse.data.message)
            setPayment('')
            setPayingAppointment('')
            getUserAppointments()
          } else {
            setPayingAppointment('')
            toast.error(verifyResponse.data.message)
          }

          return
        }

        initPay(data.order, data.key)
      } else {
        setPayingAppointment('')
        toast.error(data.message)
      }
    } catch (error) {
      setPayingAppointment('')

      toast.error(
        error?.response?.data?.message ||
          error.message
      )
    }
  }

  // RESCHEDULE APPOINTMENT
  const handleRescheduleClick = async (appointment) => {
    setSelectedForReschedule(appointment)
    setRescheduleModal(true)
    // Fetch available slots for the doctor
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/availability/${appointment.docId}`,
        { headers: { token } }
      )
      if (data.success) {
        setAvailableSlots(data.slots)
      }
    } catch (error) {
      toast.error('Could not fetch available slots')
    }
  }

  const confirmReschedule = async () => {
    if (!newSlotDate || !newSlotTime) {
      toast.error('Please select both date and time')
      return
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/reschedule-appointment`,
        {
          appointmentId: selectedForReschedule._id,
          newSlotDate,
          newSlotTime
        },
        { headers: { token } }
      )

      if (data.success) {
        toast.success('Appointment rescheduled successfully')
        setRescheduleModal(false)
        setSelectedForReschedule(null)
        setNewSlotDate('')
        setNewSlotTime('')
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  // DOWNLOAD INVOICE
  const handleDownloadInvoice = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/download-invoice`,
        { appointmentId },
        { headers: { token }, responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${appointmentId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentElement.removeChild(link)
      toast.success('Invoice downloaded')
    } catch (error) {
      toast.error('Failed to download invoice')
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token, getUserAppointments])

  return (
    <div className='min-h-screen bg-[#f6fbfb] py-3 sm:py-5 lg:py-8 px-2 sm:px-4 lg:px-0'>

      {/* HEADER */}
      <div className='mb-4 sm:mb-6 lg:mb-8 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-slate-200 bg-white p-3 sm:p-5 lg:p-8 shadow-sm'>

        <p className='text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary'>
          Appointment Dashboard
        </p>

        <div className='mt-2 sm:mt-3 lg:mt-4 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between'>

          <div className='min-w-0'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900'>
              My Appointments
            </h1>

            <p className='mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500'>
              View, manage and track all your appointments.
            </p>
          </div>

          <div className='w-full sm:w-auto rounded-xl sm:rounded-2xl bg-primary/10 px-3 sm:px-5 lg:px-6 py-3 sm:py-4 text-primary'>
            <p className='text-xs sm:text-sm font-medium'>
              Total Appointments
            </p>

            <h2 className='text-2xl sm:text-3xl font-bold'>
              {appointments.length}
            </h2>
          </div>

        </div>
      </div>

      {/* EMPTY STATE */}
      {!appointments.length && (
        <div className='rounded-xl sm:rounded-2xl lg:rounded-3xl border border-dashed border-slate-300 bg-white px-4 sm:px-5 lg:px-8 py-12 sm:py-16 lg:py-20 text-center shadow-sm'>

          <div className='mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10 text-3xl sm:text-4xl text-primary'>
            <span aria-hidden='true'>+</span>
          </div>

          <h2 className='mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-slate-900'>
            No Appointments Yet
          </h2>

          <p className='mt-2 sm:mt-3 text-sm sm:text-base text-slate-500'>
            You have not booked any appointments yet.
          </p>

          <button
            onClick={() => navigate('/doctors')}
            className='mt-6 sm:mt-8 rounded-lg sm:rounded-xl lg:rounded-full bg-primary px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90 touch-manipulation'
          >
            Book Appointment
          </button>

        </div>
      )}

      {/* APPOINTMENTS */}
      <div className='space-y-3 sm:space-y-4 lg:space-y-6'>

        {appointments.map((item) => (

          <div
            key={item._id}
            className='overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg'
          >

            <div className='grid gap-3 p-3 sm:p-4 lg:p-6 lg:grid-cols-[140px_minmax(0,1fr)_auto]'>

              {/* DOCTOR IMAGE */}
              <div className='hidden lg:block'>

                <img
                  className='h-40 w-full rounded-xl sm:rounded-2xl bg-teal-50 object-cover object-top'
                  src={item.docData.image}
                  alt={item.docData.name}
                />

              </div>

              {/* INFO */}
              <div className='flex flex-col justify-between gap-2 sm:gap-3'>

                <div>

                  <div className='flex flex-wrap items-center gap-2 sm:gap-3'>

                    <h2 className='min-w-0 break-words text-base sm:text-lg lg:text-xl font-bold text-slate-900'>
                      {item.docData.name}
                    </h2>

                    <span className='rounded-full bg-primary/10 px-3 py-1 text-xs sm:text-sm font-medium text-primary flex-shrink-0'>
                      {item.docData.speciality}
                    </span>

                  </div>

                  <div className='mt-3 sm:mt-4 grid gap-2 sm:gap-3 sm:grid-cols-2'>

                    <div className='rounded-lg sm:rounded-2xl bg-slate-50 p-3 sm:p-4'>

                      <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                        Appointment Date
                      </p>

                      <p className='mt-1 sm:mt-2 text-sm sm:text-base font-bold text-slate-900'>
                        {slotDateFormat(
                          item.slotDate
                        )}
                      </p>

                      <p className='mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500'>
                        {item.slotTime}
                      </p>

                    </div>

                    <div className='rounded-lg sm:rounded-2xl bg-slate-50 p-3 sm:p-4'>

                      <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                        Clinic Address
                      </p>

                      <p className='mt-1 sm:mt-2 break-words font-medium text-slate-800 text-xs sm:text-sm'>
                        {
                          item.docData.address
                            .line1
                        }
                      </p>

                      <p className='break-words text-slate-500 text-xs sm:text-sm'>
                        {
                          item.docData.address
                            .line2
                        }
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}
              <div className='flex flex-col gap-2 sm:gap-3 lg:justify-end'>

                {item.payment && !item.isCompleted && !item.cancelled && (
                  <button
                    onClick={() => handleDownloadInvoice(item._id)}
                    className='rounded-lg sm:rounded-xl border border-slate-200 bg-white px-3 sm:px-6 py-2 sm:py-3 font-semibold text-slate-700 transition hover:bg-primary hover:text-white flex items-center justify-center gap-2 text-xs sm:text-sm touch-manipulation'
                  >
                    <Download className='w-4 h-4' />
                    Invoice
                  </button>
                )}

                {!item.cancelled &&
                  !item.isCompleted &&
                  !item.payment && (

                    <button
                      onClick={() => setPayment(item._id)}
                      className='rounded-lg sm:rounded-xl border border-slate-200 px-3 sm:px-6 py-2 sm:py-3 font-semibold text-slate-700 transition hover:border-primary hover:bg-primary hover:text-white text-xs sm:text-sm touch-manipulation'
                    >
                      Pay Online
                    </button>
                  )}

                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  payment === item._id && (

                    <button
                      onClick={() =>
                        appointmentRazorpay(
                          item._id
                        )
                      }
                      className='flex items-center justify-center rounded-lg sm:rounded-xl border border-slate-200 bg-white px-3 sm:px-6 py-2 sm:py-3 transition hover:bg-slate-50'
                      disabled={payingAppointment === item._id}
                    >

                      {payingAppointment === item._id ? (
                        <span className='text-xs sm:text-sm font-semibold text-slate-600'>
                          Opening...
                        </span>
                      ) : (
                        <img
                          className='max-h-5 max-w-24'
                          src={
                            assets.razorpay_logo
                          }
                          alt='Razorpay'
                        />
                      )}

                    </button>
                  )}

                {!item.cancelled &&
                  item.payment &&
                  !item.isCompleted && (

                    <button 
                      onClick={() => handleRescheduleClick(item)}
                      className='rounded-lg sm:rounded-xl border border-blue-200 bg-blue-50 px-3 sm:px-6 py-2 sm:py-3 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2 text-xs sm:text-sm touch-manipulation'
                    >
                      <RotateCw className='w-4 h-4' />
                      Reschedule
                    </button>
                  )}

                {!item.cancelled &&
                  item.payment &&
                  !item.isCompleted && (

                    <button className='rounded-lg sm:rounded-xl bg-green-50 px-3 sm:px-6 py-2 sm:py-3 font-semibold text-green-700 flex items-center justify-center gap-2 text-xs sm:text-sm'>
                      <CheckCircle className='w-4 h-4' />
                      Paid
                    </button>
                  )}

                {item.isCompleted && (

                  <button className='rounded-lg sm:rounded-xl bg-primary/10 px-3 sm:px-6 py-2 sm:py-3 font-semibold text-primary flex items-center justify-center gap-2 text-xs sm:text-sm'>
                    <CheckCircle className='w-4 h-4' />
                    Completed
                  </button>
                )}

                {!item.cancelled &&
                  !item.isCompleted && (

                    <button
                      onClick={() =>
                        cancelAppointment(
                          item._id
                        )
                      }
                      className='rounded-lg sm:rounded-xl border border-red-200 px-3 sm:px-6 py-2 sm:py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white text-xs sm:text-sm touch-manipulation'
                    >
                      Cancel
                    </button>
                  )}

                {item.cancelled &&
                  !item.isCompleted && (

                    <button className='rounded-lg sm:rounded-xl bg-red-50 px-3 sm:px-6 py-2 sm:py-3 font-semibold text-red-600 flex items-center justify-center gap-2 text-xs sm:text-sm'>
                      <XCircle className='w-4 h-4' />
                      Cancelled
                    </button>
                  )}

              </div>

            </div>

          </div>

        ))}

      </div>

    {/* RESCHEDULE MODAL */}
    {rescheduleModal && selectedForReschedule && (
      <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-3 sm:p-4'>
        <div className='w-full max-w-md rounded-t-2xl sm:rounded-3xl bg-white p-4 sm:p-6 lg:p-8 shadow-2xl'>
          <div className='mb-4 sm:mb-6 flex items-center justify-between gap-3'>
            <h2 className='text-lg sm:text-2xl font-bold text-slate-900'>Reschedule</h2>
            <button
              onClick={() => setRescheduleModal(false)}
              className='text-2xl text-slate-400 transition hover:text-slate-600 flex-shrink-0 touch-manipulation'
            >
              ✕
            </button>
          </div>

          <div className='mb-4 sm:mb-6 rounded-lg sm:rounded-2xl bg-slate-50 p-3 sm:p-4'>
            <p className='text-xs sm:text-sm text-slate-500'>Current Appointment</p>
            <p className='font-semibold text-slate-900 text-sm sm:text-base'>
              Dr. {selectedForReschedule.docData.name}
            </p>
            <p className='text-xs sm:text-sm text-slate-600'>
              {slotDateFormat(selectedForReschedule.slotDate)} at {selectedForReschedule.slotTime}
            </p>
          </div>

          <div className='space-y-3 sm:space-y-4 mb-4 sm:mb-6'>
            <div>
              <label className='mb-2 block text-xs sm:text-sm font-semibold text-slate-700'>
                Select New Date
              </label>
              <input
                type='date'
                value={newSlotDate}
                onChange={(e) => setNewSlotDate(e.target.value)}
                className='w-full rounded-lg sm:rounded-xl border border-slate-200 px-3 sm:px-4 py-2 sm:py-3 focus:border-primary focus:outline-none text-xs sm:text-sm'
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className='mb-2 block text-xs sm:text-sm font-semibold text-slate-700'>
                Select New Time
              </label>
              <select
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                className='w-full rounded-lg sm:rounded-xl border border-slate-200 px-3 sm:px-4 py-2 sm:py-3 focus:border-primary focus:outline-none text-xs sm:text-sm'
              >
                <option value=''>Choose time slot</option>
                <option value='10:00 AM'>10:00 AM</option>
                <option value='10:30 AM'>10:30 AM</option>
                <option value='11:00 AM'>11:00 AM</option>
                <option value='11:30 AM'>11:30 AM</option>
                <option value='02:00 PM'>02:00 PM</option>
                <option value='02:30 PM'>02:30 PM</option>
                <option value='03:00 PM'>03:00 PM</option>
                <option value='03:30 PM'>03:30 PM</option>
                <option value='04:00 PM'>04:00 PM</option>
                <option value='04:30 PM'>04:30 PM</option>
              </select>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            <button
              onClick={() => setRescheduleModal(false)}
              className='flex-1 rounded-lg sm:rounded-xl border border-slate-200 px-4 py-2 sm:py-3 font-semibold text-slate-700 transition hover:bg-slate-100 text-xs sm:text-sm touch-manipulation'
            >
              Cancel
            </button>
            <button
              onClick={confirmReschedule}
              className='flex-1 rounded-lg sm:rounded-xl bg-primary px-4 py-2 sm:py-3 font-semibold text-white transition hover:opacity-90 text-xs sm:text-sm touch-manipulation'
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default MyAppointments
