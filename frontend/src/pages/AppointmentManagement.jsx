import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Calendar, Clock, AlertCircle, CheckCircle, Plus } from 'lucide-react'

const AppointmentManagement = ({ isDarkMode }) => {
  const [appointments, setAppointments] = useState([])
  const [recurringAppointments, setRecurringAppointments] = useState([])
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [loading, setLoading] = useState(false)

  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: ''
  })

  const [recurringData, setRecurringData] = useState({
    docId: '',
    frequency: 'weekly',
    startDate: '',
    slotTime: '',
    endDate: '',
    maxOccurrences: '',
    notes: ''
  })

  const backendURL = import.meta.env.VITE_BACKEND_URL
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchAppointments()
    fetchRecurringAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/user/appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setAppointments(data.appointments)
      }
    } catch (error) {
    }
  }

  const fetchRecurringAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/user/recurring-appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setRecurringAppointments(data.recurring)
      }
    } catch (error) {
    }
  }

  const handleReschedule = async (e) => {
    e.preventDefault()

    if (!rescheduleData.newDate || !rescheduleData.newTime) {
      toast.error('Please select date and time')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/reschedule-appointment`,
        {
          userId,
          appointmentId: selectedAppointment._id,
          newDate: rescheduleData.newDate,
          newTime: rescheduleData.newTime
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success('Appointment rescheduled successfully')
        setShowRescheduleModal(false)
        setRescheduleData({ newDate: '', newTime: '' })
        fetchAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to reschedule appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleBookRecurring = async (e) => {
    e.preventDefault()

    if (!recurringData.docId || !recurringData.startDate || !recurringData.slotTime || !recurringData.frequency) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/book-recurring`,
        {
          userId,
          ...recurringData
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success('Recurring appointment booked successfully')
        setShowRecurringModal(false)
        setRecurringData({
          docId: '',
          frequency: 'weekly',
          startDate: '',
          slotTime: '',
          endDate: '',
          maxOccurrences: '',
          notes: ''
        })
        fetchRecurringAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to book recurring appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRecurring = async (recurringId) => {
    if (!window.confirm('Are you sure you want to cancel this recurring appointment?')) return

    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/cancel-recurring`,
        { userId, recurringId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success('Recurring appointment cancelled')
        fetchRecurringAppointments()
      }
    } catch (error) {
      toast.error('Failed to cancel recurring appointment')
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-3 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Appointment Management</h1>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your appointments and schedule recurring visits
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 overflow-x-auto border-b border-gray-300 dark:border-gray-700 pb-0">
          <button className="px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-blue-500 font-semibold text-sm sm:text-base whitespace-nowrap">
            Appointments
          </button>
          <button className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-semibold whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Recurring ({recurringAppointments.length})
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-3 sm:space-y-4">
          {appointments.length > 0 ? (
            appointments.map((apt) => (
              <div
                key={apt._id}
                className={`p-3 sm:p-5 lg:p-6 border rounded-lg sm:rounded-xl transition ${
                  isDarkMode
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold">Dr. {apt.docData?.name}</h3>
                    <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {apt.docData?.speciality}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {apt.isCompleted && (
                      <span className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold whitespace-nowrap">
                        <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                        Completed
                      </span>
                    )}
                    {apt.cancelled && (
                      <span className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold whitespace-nowrap">
                        <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{new Date(apt.slotDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{apt.slotTime}</span>
                  </div>
                </div>

                {apt.notes && (
                  <p className={`mb-4 text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <strong>Notes:</strong> {apt.notes}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {!apt.cancelled && !apt.isCompleted && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedAppointment(apt)
                          setShowRescheduleModal(true)
                        }}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition text-xs sm:text-sm font-medium w-full sm:w-auto"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => {
                          // Cancel appointment logic
                        }}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-lg sm:rounded-xl hover:bg-red-600 transition text-xs sm:text-sm font-medium w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No appointments scheduled
            </p>
          )}
        </div>

        {/* Recurring Appointments Section */}
        <div className="mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Recurring Appointments</h2>
            <button
              onClick={() => setShowRecurringModal(true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-500 text-white rounded-lg sm:rounded-xl hover:bg-green-600 transition text-xs sm:text-sm font-medium w-full sm:w-auto"
            >
              <Plus size={16} className="sm:w-5 sm:h-5" />
              Schedule Recurring
            </button>
          </div>

          {recurringAppointments.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {recurringAppointments.map((rec) => (
                <div
                  key={rec._id}
                  className={`p-3 sm:p-5 lg:p-6 border rounded-lg sm:rounded-xl ${
                    isDarkMode
                      ? 'border-gray-700 bg-gray-800'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">
                        {rec.frequency.charAt(0).toUpperCase() + rec.frequency.slice(1)} Appointments
                      </h3>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Starting: {new Date(rec.startDate).toLocaleDateString()}
                        </p>
                        <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          Time: {rec.slotTime} | Created: {rec.occurrencesCreated} appointments
                        </p>
                      </div>
                    </div>
                    {rec.active && (
                      <button
                        onClick={() => handleCancelRecurring(rec._id)}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-lg sm:rounded-xl hover:bg-red-600 transition text-xs sm:text-sm font-medium w-full sm:w-auto"
                      >
                        Cancel Recurring
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No recurring appointments scheduled
            </p>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl shadow-lg w-full max-w-md`}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Reschedule Appointment</h2>
            <form onSubmit={handleReschedule} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">New Date</label>
                <input
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) => setRescheduleData({...rescheduleData, newDate: e.target.value})}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">New Time</label>
                <input
                  type="time"
                  value={rescheduleData.newTime}
                  onChange={(e) => setRescheduleData({...rescheduleData, newTime: e.target.value})}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 disabled:bg-gray-400 transition text-xs sm:text-sm font-medium"
                >
                  {loading ? 'Rescheduling...' : 'Reschedule'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-500 text-white rounded-lg sm:rounded-xl hover:bg-gray-600 transition text-xs sm:text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentManagement
