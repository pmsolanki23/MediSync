import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Share2, Copy, Users, Gift } from 'lucide-react'

const ReferralComponent = ({ userId, isDarkMode }) => {
  const [referralStats, setReferralStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const backendURL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (userId) {
      fetchReferralStats()
    }
  }, [userId])

  const fetchReferralStats = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/referral-stats`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (data.success) {
        // If no stats, create referral
        if (!data.stats.referralCode) {
          await createReferral()
        } else {
          setReferralStats(data.stats)
        }
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const createReferral = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/create-referral`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (data.success) {
        setReferralStats({
          referralCode: data.referral.referralCode,
          totalReferrals: 0,
          completedReferrals: 0,
          totalBonusEarned: 0,
          referralsList: []
        })
      }
    } catch (error) {
    }
  }

  const handleCopyCode = () => {
    if (referralStats?.referralCode) {
      navigator.clipboard.writeText(referralStats.referralCode)
      setCopied(true)
      toast.success('Referral code copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareCode = () => {
    if (referralStats?.referralCode) {
      const text = `Join MediSync using my referral code: ${referralStats.referralCode} and get ₹300 bonus on signup!`
      
      // Try to use native share if available
      if (navigator.share) {
        navigator.share({
          title: 'MediSync Referral',
          text
        })
      } else {
        navigator.clipboard.writeText(text)
        toast.success('Share text copied to clipboard!')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading referral data...</div>
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-md`}>
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <Share2 size={24} />
        Referral Program
      </h3>

      {referralStats && (
        <div className='space-y-4 sm:space-y-6'>
          {/* Referral Code Box */}
          <div className={`${isDarkMode ? 'bg-gradient-to-r from-purple-900 to-purple-700' : 'bg-gradient-to-r from-purple-500 to-purple-600'} text-white p-4 sm:p-6 rounded-lg sm:rounded-2xl`}>
            <p className="text-xs sm:text-sm opacity-90 mb-2">Your Referral Code</p>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wider break-all">{referralStats.referralCode}</h2>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-purple-700 rounded-lg transition touch-manipulation"
                  title="Copy code"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={handleShareCode}
                  className="p-2 hover:bg-purple-700 rounded-lg transition touch-manipulation"
                  title="Share code"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            {copied && <p className="text-xs sm:text-sm mt-2">✓ Copied!</p>}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Total Referrals</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{referralStats.totalReferrals}</p>
            </div>

            <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Completed</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2 text-green-500">{referralStats.completedReferrals}</p>
            </div>

            <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <p className={`text-xs sm:text-sm flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                <Gift size={16} />
                Bonus
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-2 text-yellow-500">₹{referralStats.totalBonusEarned}</p>
            </div>
          </div>

          {/* How It Works */}
          <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">How It Works</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex gap-2">
                <span className="font-bold flex-shrink-0">1.</span>
                <span>Share your referral code with friends</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold flex-shrink-0">2.</span>
                <span>They sign up using your code and get ₹300 bonus</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold flex-shrink-0">3.</span>
                <span>You earn ₹500 for each successful referral</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold flex-shrink-0">4.</span>
                <span>Bonus is automatically credited to your wallet</span>
              </li>
            </ul>
          </div>

          {/* Referrals List */}
          {referralStats.referralsList && referralStats.referralsList.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Users size={18} />
                Your Referrals
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {referralStats.referralsList.map((ref, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 ${
                      isDarkMode
                        ? 'border-gray-700 bg-gray-900'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className='min-w-0'>
                      <p className="font-medium text-xs sm:text-sm break-all">{ref.referredEmail}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(ref.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      ref.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReferralComponent
