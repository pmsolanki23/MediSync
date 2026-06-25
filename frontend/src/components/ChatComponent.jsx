import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Send, Phone, Video } from 'lucide-react'

const ChatComponent = ({ userId, conversationId, isDarkMode, doctorName, doctorImage }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const backendURL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (conversationId) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 3000) // Poll every 3 seconds
      return () => clearInterval(interval)
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/get-messages`,
        { conversationId, userId, page: 1, limit: 50 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim()) {
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/send-message`,
        {
          senderId: userId,
          senderType: 'user',
          receiverId: conversationId.split('-')[1],
          message: newMessage
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (data.success) {
        setNewMessage('')
        fetchMessages()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg sm:rounded-2xl shadow-md h-96 sm:h-[500px] flex flex-col`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b p-3 sm:p-4 flex items-center justify-between rounded-t-lg sm:rounded-t-2xl`}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {doctorImage && <img src={doctorImage} alt={doctorName} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0" />}
          <p className="font-semibold text-sm sm:text-base break-words">{doctorName}</p>
        </div>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <button className="p-2 hover:bg-gray-300 rounded-full dark:hover:bg-gray-700 touch-manipulation">
            <Phone size={16} />
          </button>
          <button className="p-2 hover:bg-gray-300 rounded-full dark:hover:bg-gray-700 touch-manipulation">
            <Video size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3`}>
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
                  msg.senderId === userId
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : isDarkMode
                    ? 'bg-gray-700 rounded-bl-none'
                    : 'bg-gray-100 rounded-bl-none'
                }`}
              >
                <p className='break-words'>{msg.message}</p>
                <p className={`text-xs mt-1 opacity-70 whitespace-nowrap`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className={`text-center py-8 text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No messages yet. Start a conversation!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t p-2 sm:p-4 flex gap-2 rounded-b-lg sm:rounded-b-2xl`}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <button
          type="submit"
          disabled={loading || !newMessage.trim()}
          className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 touch-manipulation flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

export default ChatComponent
