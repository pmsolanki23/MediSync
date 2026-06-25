import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bell, Check, Trash2, Eye } from 'lucide-react'

const NotificationCenter = ({ userId, isDarkMode }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(false)

  const backendURL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (userId) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 10000) // Poll every 10 seconds
      return () => clearInterval(interval)
    }
  }, [userId])

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/get-notifications`,
        { userId, page: 1, limit: 10 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (data.success) {
        setNotifications(data.notifications)

        // Get unread count
        const { data: countData } = await axios.post(
          `${backendURL}/api/user/unread-count`,
          { userId },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )

        if (countData.success) {
          setUnreadCount(countData.unreadCount)
        }
      }
    } catch (error) {
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/mark-notification-read`,
        { userId, notificationId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (data.success) {
        fetchNotifications()
      }
    } catch (error) {
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/mark-all-read`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (data.success) {
        fetchNotifications()
      }
    } catch (error) {
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.post(
        `${backendURL}/api/user/delete-notification`,
        { userId, notificationId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      fetchNotifications()
    } catch (error) {
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      appointment: '📅',
      prescription: '💊',
      payment: '💳',
      message: '💬',
      system: 'ℹ️'
    }
    return icons[type] || '🔔'
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={`relative p-2 rounded-full transition touch-manipulation ${
          isDarkMode
            ? 'hover:bg-gray-700'
            : 'hover:bg-gray-200'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className={`absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg sm:rounded-2xl shadow-lg z-50 ${
          isDarkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-3 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center gap-2`}>
            <h3 className="font-bold text-base sm:text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs sm:text-sm text-blue-500 hover:underline flex items-center gap-1 touch-manipulation whitespace-nowrap"
              >
                <Check size={14} />
                Mark all
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 sm:p-4 hover:bg-opacity-50 transition text-xs sm:text-sm ${
                    !notification.read
                      ? isDarkMode
                        ? 'bg-gray-700'
                        : 'bg-blue-50'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold break-words">{notification.title}</p>
                      <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 break-words`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-blue-500 hover:text-blue-700 touch-manipulation p-1"
                          title="Mark as read"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="text-red-500 hover:text-red-700 touch-manipulation p-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`p-4 text-center text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No notifications
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationCenter
