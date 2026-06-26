import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContextObject'
import axios from 'axios'
import { toast } from 'react-toastify'

const Messages = () => {
  const { backendUrl, token, userData } = useContext(AppContext)
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-conversations`,
        {},
        { headers: { token } }
      )
      if (data.success) {
        setConversations(data.conversations)
      }
    } catch (error) {
      toast.error('Failed to load conversations')
    }
  }

  const fetchMessages = async (conversationId) => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-messages`,
        { conversationId },
        { headers: { token } }
      )
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation._id)
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      toast.warning('Please type a message')
      return
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/send-message`,
        {
          conversationId: selectedConversation._id,
          content: newMessage
        },
        { headers: { token } }
      )

      if (data.success) {
        setNewMessage('')
        fetchMessages(selectedConversation._id)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const deleteConversation = async (conversationId) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/delete-conversation`,
        { conversationId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success('Conversation deleted')
        setSelectedConversation(null)
        fetchConversations()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to delete conversation')
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f9ff] py-4 sm:py-5 lg:py-10'>
      <div className='mx-auto max-w-7xl px-3 sm:px-6 lg:px-8'>
        {/* HEADER */}
        <div className='mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 lg:p-8 shadow-sm'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900'>
            💬 Messages
          </h1>
          <p className='mt-2 text-xs sm:text-sm lg:text-base text-slate-500'>
            Chat with doctors about your health concerns
          </p>
        </div>

        <div className='grid gap-4 sm:gap-6 lg:grid-cols-3'>
          {/* CONVERSATIONS LIST */}
          <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col'>
            <div className='border-b border-slate-200 p-4 sm:p-5 lg:p-6'>
              <h2 className='font-bold text-slate-900 text-sm sm:text-base'>Conversations</h2>
            </div>

            {conversations.length === 0 ? (
              <div className='p-4 sm:p-6 text-center text-slate-500 text-xs sm:text-sm flex-1 flex items-center justify-center'>
                <p>No conversations yet</p>
              </div>
            ) : (
              <div className='max-h-96 overflow-y-auto flex-1'>
                {conversations.map((conv) => (
                  <button
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full border-b border-slate-100 p-3 sm:p-4 text-left transition hover:bg-slate-50 ${
                      selectedConversation?._id === conv._id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <h3 className='font-semibold text-slate-900 text-sm sm:text-base truncate'>
                      {(() => {
                        const otherParticipantId = conv.participants.find(id => id !== userData._id)
                        return conv.participantNames?.[otherParticipantId] || 'User'
                      })()}
                    </h3>
                    <p className='mt-1 truncate text-xs sm:text-sm text-slate-500'>
                      {conv.lastMessage}
                    </p>
                    <p className='mt-2 text-xs text-slate-400'>
                      {new Date(conv.lastMessageTime).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MESSAGES AREA */}
          <div className='lg:col-span-2 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl overflow-hidden flex flex-col max-h-96 sm:max-h-[500px] lg:max-h-[600px]'>
            {selectedConversation ? (
              <>
                {/* CHAT HEADER */}
                <div className='border-b border-slate-200 p-3 sm:p-4 lg:p-6 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent'>
                  <div className='min-w-0 flex-1'>
                    <h2 className='font-bold text-slate-900 text-sm sm:text-base truncate'>
                      {(() => {
                        const otherParticipantId = selectedConversation.participants.find(id => id !== userData._id)
                        return selectedConversation.participantNames?.[otherParticipantId] || 'User'
                      })()}
                    </h2>
                    <p className='text-xs sm:text-sm text-slate-500'>Active now</p>
                  </div>
                  <button
                    onClick={() => deleteConversation(selectedConversation._id)}
                    className='text-red-600 transition hover:text-red-700 text-xs sm:text-sm font-semibold ml-2 whitespace-nowrap'
                  >
                    Delete
                  </button>
                </div>

                {/* MESSAGES */}
                <div className='flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4'>
                  {loading ? (
                    <div className='text-center text-slate-500 text-xs sm:text-sm'>Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className='text-center text-slate-500 text-xs sm:text-sm'>
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.senderId === userData._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 max-w-xs text-xs sm:text-sm break-words ${
                            msg.senderId === userData._id
                              ? 'bg-primary text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className='mt-1 text-xs opacity-70'>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* MESSAGE INPUT */}
                <div className='border-t border-slate-200 p-3 sm:p-4 lg:p-6 bg-slate-50'>
                  <div className='flex gap-2 sm:gap-3'>
                    <input
                      type='text'
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder='Type your message...'
                      className='flex-1 rounded-xl sm:rounded-2xl border border-slate-200 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:border-primary focus:outline-none transition'
                    />
                    <button
                      onClick={sendMessage}
                      className='rounded-xl sm:rounded-2xl bg-primary px-3 sm:px-5 py-2 sm:py-3 font-semibold text-white transition hover:opacity-90 text-xs sm:text-sm whitespace-nowrap'
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className='flex flex-1 items-center justify-center p-4 sm:p-6 text-center text-slate-500'>
                <div>
                  <p className='text-3xl sm:text-4xl mb-2'>💭</p>
                  <p className='text-xs sm:text-sm'>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
