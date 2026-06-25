import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Lock, Mail, Clock } from 'lucide-react'

const OTPVerificationComponent = ({ email, onVerified, isDarkMode }) => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [timer, setTimer] = useState(0)
  const [verified, setVerified] = useState(false)

  const backendURL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Email is required')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(`${backendURL}/api/user/send-otp`, { email })

      if (data.success) {
        toast.success('OTP sent to your email')
        setOtpSent(true)
        setTimer(60)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(`${backendURL}/api/user/verify-otp`, {
        email,
        otp
      })

      if (data.success) {
        toast.success('OTP verified successfully')
        setVerified(true)
        if (onVerified) {
          onVerified(true)
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  if (verified) {
    return (
      <div className={`border rounded-lg sm:rounded-2xl p-3 sm:p-4 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-green-50 border-green-200'}`}>
        <p className="text-green-600 font-semibold text-sm sm:text-base">✓ Email verified successfully</p>
      </div>
    )
  }

  return (
    <div className={`p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}>
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
        <Lock size={20} className="sm:w-6 sm:h-6" />
        Two-Factor Authentication
      </h3>

      {!otpSent ? (
        <div className="space-y-4 sm:space-y-5">
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            An OTP will be sent to: <strong className="break-all">{email}</strong>
          </p>
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className={`w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-lg sm:rounded-xl font-medium flex items-center justify-center gap-2 transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Mail size={16} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{loading ? 'Sending...' : 'Send OTP'}</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-5">
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter the 6-digit OTP sent to your email
          </p>

          <div>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="000000"
              className={`w-full px-4 sm:px-5 py-3 sm:py-4 text-center text-2xl sm:text-3xl font-bold border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-lg sm:rounded-xl font-medium transition text-sm sm:text-base ${
              loading || otp.length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {timer > 0 ? (
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
              <Clock size={14} className="sm:w-4 sm:h-4" />
              <span>Resend OTP in {timer}s</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full py-2 sm:py-2.5 text-blue-500 hover:underline text-xs sm:text-sm font-medium"
            >
              Resend OTP
            </button>
          )}
        </form>
      )}
    </div>
  )
}

export default OTPVerificationComponent
