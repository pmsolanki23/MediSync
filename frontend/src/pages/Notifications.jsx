import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContextObject'
import axios from 'axios'
import { toast } from 'react-toastify'

const Notifications = () => {
  const { backendUrl, token } = useContext(AppContext)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('userId')
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-notifications`,
        { userId },
        { headers: { token } }
      )
      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/mark-notification-read`,
        { notificationId },
        { headers: { token } }
      )
      if (data.success) {
        fetchNotifications()
      }
    } catch (error) {
    }
  }

  const markAllAsRead = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const { data } = await axios.post(
        `${backendUrl}/api/user/mark-all-read`,
        { userId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success('All marked as read')
        fetchNotifications()
      }
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/delete-notification`,
        { notificationId },
        { headers: { token } }
      )
      if (data.success) {
        fetchNotifications()
      }
    } catch (error) {
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅'
      case 'payment':
        return '💳'
      case 'prescription':
        return '📋'
      case 'message':
        return '💬'
      case 'review':
        return '⭐'
      default:
        return '🔔'
    }
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications

  return (
    <div className='min-h-screen bg-[#f5f9ff] py-4 sm:py-5 lg:py-10'>
      <div className='mx-auto max-w-4xl px-3 sm:px-6 lg:px-8'>
        {/* HEADER */}
        <div className='mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 lg:p-8 shadow-sm'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6'>
            <div>
              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900'>
                🔔 Notifications
              </h1>
              <p className='mt-2 text-xs sm:text-sm lg:text-base text-slate-500'>
                Stay updated with your health and appointments
              </p>
            </div>
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={markAllAsRead}
                className='rounded-xl sm:rounded-2xl bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90 whitespace-nowrap'
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div className='mb-6 flex flex-wrap gap-2 sm:gap-3'>
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 font-semibold transition text-xs sm:text-sm ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 font-semibold transition text-xs sm:text-sm ${
              filter === 'unread'
                ? 'bg-primary text-white'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Unread
          </button>
        </div>

        {/* NOTIFICATIONS LIST */}
        {loading ? (
          <div className='text-center py-12 text-slate-500 text-sm'>Loading...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className='rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center shadow-sm'>
            <p className='text-2xl sm:text-3xl mb-2'>🎉</p>
            <p className='text-slate-600 text-sm sm:text-base'>
              {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div className='space-y-2 sm:space-y-3'>
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-xl sm:rounded-2xl border p-3 sm:p-4 lg:p-6 shadow-sm transition ${
                  notification.isRead
                    ? 'border-slate-200 bg-white'
                    : 'border-primary/20 bg-primary/5 border-l-4 border-l-primary'
                }`}
              >
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4'>
                  <div className='flex gap-3 sm:gap-4 flex-1 min-w-0'>
                    <div className='text-xl sm:text-2xl flex-shrink-0'>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-bold text-slate-900 text-sm sm:text-base truncate'>
                        {notification.title}
                      </h3>
                      <p className='mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2'>
                        {notification.message}
                      </p>
                      <p className='mt-2 sm:mt-3 text-xs text-slate-500'>
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-row sm:flex-col gap-2 sm:gap-2 self-start sm:self-auto'>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className='rounded-lg bg-primary/10 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white whitespace-nowrap'
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className='rounded-lg bg-red-50 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white whitespace-nowrap'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
