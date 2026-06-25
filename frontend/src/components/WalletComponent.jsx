import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContextObject'
import { Wallet, Plus, Copy, TrendingUp } from 'lucide-react'

const WalletComponent = () => {
  const { token, backendUrl, currencySymbol } = useContext(AppContext)
  const [wallet, setWallet] = useState(null)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    fetchWallet()
    fetchReferralCode()
  }, [])

  const fetchWallet = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-wallet`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setWallet(data.wallet)
      }
    } catch (error) {
      toast.error('Failed to load wallet')
    }
  }

  const fetchReferralCode = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/wallet/referral-code`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setReferralCode(data.referralCode)
      }
    } catch (error) {
    }
  }

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.warning('Please enter valid amount')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-money-wallet`,
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success('Funds added successfully')
        setWallet(data.wallet)
        setAmount('')
        setShowAddFunds(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!wallet) return <div className='text-center py-8 text-slate-500'>Loading...</div>

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Wallet Balance with Image */}
      <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-gradient-to-br from-primary/5 to-cyan-50 p-4 sm:p-6 lg:p-8 shadow-sm'>
        <div className='flex flex-col gap-4 sm:gap-6 items-center sm:items-start'>
          <div className='w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center'>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className='w-24 h-24 sm:w-32 sm:h-32'>
              <defs>
                <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <rect x="30" y="60" width="140" height="80" rx="10" fill="url(#walletGrad)" />
              <rect x="40" y="70" width="20" height="20" rx="3" fill="#fbbf24" opacity="0.8" />
              <circle cx="85" cy="78" r="2" fill="#ffffff" opacity="0.6" />
              <circle cx="95" cy="78" r="2" fill="#ffffff" opacity="0.6" />
              <circle cx="105" cy="78" r="2" fill="#ffffff" opacity="0.6" />
              <circle cx="115" cy="78" r="2" fill="#ffffff" opacity="0.6" />
              <circle cx="50" cy="35" r="15" fill="#fbbf24" />
              <circle cx="50" cy="35" r="13" fill="#fcd34d" />
              <text x="50" y="42" textAnchor="middle" fill="#78350f" fontSize="20" fontWeight="bold">₹</text>
              <circle cx="100" cy="30" r="12" fill="#fbbf24" opacity="0.7" />
              <circle cx="100" cy="30" r="10" fill="#fcd34d" opacity="0.7" />
              <text x="155" y="100" fontSize="24" fill="#ffffff" fontWeight="bold">$</text>
              <text x="155" y="120" fontSize="14" fill="#ffffff" opacity="0.8" fontWeight="bold">USD</text>
            </svg>
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-2'>
              <Wallet className='w-5 h-5 text-primary' />
              <p className='text-sm font-semibold uppercase tracking-widest text-primary'>Wallet Balance</p>
            </div>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4'>
              {currencySymbol} {wallet.balance.toFixed(2)}
            </h1>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto'>
              <button
                onClick={() => setShowAddFunds(true)}
                className='rounded-xl sm:rounded-2xl bg-primary px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2 touch-manipulation'
              >
                <Plus className='w-4 h-4' />
                Add Funds
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referralCode)
                  toast.success('Referral code copied!')
                }}
                className='rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2 touch-manipulation'
              >
                <Copy className='w-4 h-4' />
                <span className='hidden sm:inline'>{referralCode}</span>
                <span className='sm:hidden'>Copy Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4'>
          <div className='w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-4 sm:p-8 shadow-2xl'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <Wallet className='w-6 h-6 text-primary' />
              <h2 className='text-xl sm:text-2xl font-bold text-slate-900'>Add Funds to Wallet</h2>
            </div>

            <div className='mb-4 sm:mb-6'>
              <label className='mb-2 block text-sm font-medium text-slate-700'>Amount</label>
              <div className='flex gap-2'>
                <span className='flex items-center px-3 sm:px-4 py-3 bg-slate-100 rounded-lg sm:rounded-xl text-slate-700 font-semibold text-sm sm:text-base'>
                  {currencySymbol}
                </span>
                <input
                  type='number'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder='Enter amount'
                  className='flex-1 rounded-lg sm:rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-primary'
                />
              </div>
            </div>

            <div className='mb-6 space-y-2'>
              {[500, 1000, 2000, 5000].map((preset) => (
                <button
                  key={preset}
                  type='button'
                  onClick={() => setAmount(preset.toString())}
                  className='w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-3 text-xs sm:text-sm font-medium text-slate-700 transition hover:border-primary hover:bg-primary/5 touch-manipulation'
                >
                  {currencySymbol} {preset}
                </button>
              ))}
            </div>

            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
              <button
                onClick={handleAddFunds}
                disabled={loading}
                className='flex-1 rounded-lg sm:rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70 touch-manipulation'
              >
                {loading ? 'Processing...' : 'Add Funds'}
              </button>
              <button
                onClick={() => { setShowAddFunds(false); setAmount(''); }}
                className='flex-1 rounded-lg sm:rounded-xl border border-slate-200 px-6 py-3 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 touch-manipulation'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <TrendingUp className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />
          <h2 className='text-xl sm:text-2xl font-bold text-slate-900'>Transaction History</h2>
        </div>

        {wallet.transactions.length === 0 ? (
          <p className='text-center py-8 sm:py-12 text-slate-500 text-sm sm:text-base'>No transactions yet</p>
        ) : (
          <div className='space-y-2 sm:space-y-3'>
            {wallet.transactions.slice().reverse().map((transaction, index) => (
              <div key={index} className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg sm:rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4'>
                <div className='flex items-center gap-3'>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '−'}
                    </span>
                  </div>
                  <div className='min-w-0'>
                    <p className='font-semibold text-slate-900 text-sm sm:text-base break-words'>{transaction.description}</p>
                    <p className='text-xs text-slate-500'>
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`font-bold text-sm sm:text-base whitespace-nowrap ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'credit' ? '+' : '−'}{currencySymbol} {transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referral Info with Image */}
      <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8 shadow-sm'>
        <div className='flex flex-col gap-4 sm:gap-6 items-center sm:items-start'>
          <div className='w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center'>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className='w-24 h-24 sm:w-32 sm:h-32'>
              <defs>
                <linearGradient id="refGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="50" r="20" fill="url(#refGrad)" />
              <rect x="75" y="80" width="50" height="40" rx="5" fill="url(#refGrad)" opacity="0.8" />
              <circle cx="50" cy="110" r="15" fill="#a855f7" opacity="0.7" />
              <rect x="32" y="135" width="36" height="30" rx="4" fill="#a855f7" opacity="0.6" />
              <circle cx="100" cy="120" r="15" fill="#a855f7" opacity="0.7" />
              <rect x="82" y="145" width="36" height="30" rx="4" fill="#a855f7" opacity="0.6" />
              <circle cx="150" cy="110" r="15" fill="#a855f7" opacity="0.7" />
              <rect x="132" y="135" width="36" height="30" rx="4" fill="#a855f7" opacity="0.6" />
              <line x1="90" y1="70" x2="55" y2="100" stroke="url(#refGrad)" strokeWidth="2" opacity="0.5" strokeDasharray="5,5" />
              <line x1="100" y1="70" x2="100" y2="105" stroke="url(#refGrad)" strokeWidth="2" opacity="0.5" strokeDasharray="5,5" />
              <line x1="110" y1="70" x2="145" y2="100" stroke="url(#refGrad)" strokeWidth="2" opacity="0.5" strokeDasharray="5,5" />
              <circle cx="70" cy="55" r="12" fill="#fbbf24" />
              <text x="70" y="61" textAnchor="middle" fill="#78350f" fontSize="16" fontWeight="bold">+</text>
            </svg>
          </div>
          <div className='flex-1 w-full'>
            <h3 className='text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3'>Referral Program</h3>
            <p className='text-xs sm:text-sm text-slate-600 mb-4'>
              Share your referral code with friends and earn {currencySymbol}100 when they make their first appointment!
            </p>
            <div className='rounded-lg sm:rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 sm:p-4 text-center'>
              <p className='text-xs text-slate-500 mb-2'>Your Referral Code</p>
              <p className='text-lg sm:text-2xl font-bold text-primary font-mono break-all'>{referralCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletComponent
