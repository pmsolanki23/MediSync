import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContextObject'
import axios from 'axios'
import { toast } from 'react-toastify'

const Invoices = () => {
  const { backendUrl, token, currencySymbol } = useContext(AppContext)
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  useEffect(() => {
    fetchInvoices()
    fetchStats()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const userId = userData?._id || localStorage.getItem('userId')
      if (!userId) {
        toast.error('User ID not found')
        setLoading(false)
        return
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/get-invoices`,
        { userId },
        { headers: { token } }
      )
      if (data.success) {
        setInvoices(data.invoices)
      } else {
        toast.error(data.message || 'Failed to load invoices')
      }
    } catch (error) {
      console.error('Invoice fetch error:', error)
      toast.error('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const { data } = await axios.post(
        `${backendUrl}/api/user/invoice-stats`,
        { userId },
        { headers: { token } }
      )
      if (data.success) {
        setStats({
          totalInvoices: data.stats.total,
          totalAmount: data.stats.totalAmount,
          outstandingAmount: data.stats.pendingAmount
        })
      }
    } catch (error) {
      console.error('Failed to load stats', error)
    }
  }

  const downloadInvoice = async (invoiceId) => {
    try {
      const userId = localStorage.getItem('userId')
      const { data } = await axios.post(
        `${backendUrl}/api/user/download-invoice`,
        { userId, invoiceId },
        { headers: { token } }
      )

      if (data.success) {
        // Create a simple text/HTML representation if PDF generation isn't available
        const invoiceText = `
MEDISYNC INVOICE
================================
Invoice #: ${data.invoice.invoiceNumber}
Date: ${new Date(data.invoice.issueDate).toLocaleDateString()}
Status: ${data.invoice.status}

Doctor: ${data.invoice.doctorName}
Speciality: ${data.invoice.doctorSpeciality}

Amount: ${data.invoice.amount}
Payment Method: ${data.invoice.paymentMethod}

================================
        `
        const element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceText))
        element.setAttribute('download', `invoice-${invoiceId}.txt`)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
        toast.success('Invoice downloaded')
      }
    } catch (error) {
      toast.error('Failed to download invoice')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f9ff] py-4 sm:py-5 lg:py-10'>
      <div className='mx-auto max-w-7xl px-3 sm:px-6 lg:px-8'>
        {/* HEADER */}
        <div className='mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 lg:p-8 shadow-sm'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900'>
            📄 Invoices
          </h1>
          <p className='mt-2 text-xs sm:text-sm lg:text-base text-slate-500'>
            View and download all your medical invoices
          </p>
        </div>

        {/* STATS */}
        {stats && (
          <div className='mb-6 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3'>
            <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm'>
              <p className='text-xs sm:text-sm text-slate-500 font-semibold'>Total Invoices</p>
              <h2 className='mt-2 text-2xl sm:text-3xl font-bold text-slate-900'>{stats.totalInvoices}</h2>
            </div>
            <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm'>
              <p className='text-xs sm:text-sm text-slate-500 font-semibold'>Total Amount</p>
              <h2 className='mt-2 text-2xl sm:text-3xl font-bold text-slate-900'>
                {currencySymbol} {stats.totalAmount}
              </h2>
            </div>
            <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm'>
              <p className='text-xs sm:text-sm text-slate-500 font-semibold'>Outstanding</p>
              <h2 className='mt-2 text-2xl sm:text-3xl font-bold text-red-600'>
                {currencySymbol} {stats.outstandingAmount}
              </h2>
            </div>
          </div>
        )}

        {/* INVOICES LIST */}
        {loading ? (
          <div className='text-center py-12 text-slate-500 text-sm'>Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className='rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center shadow-sm'>
            <p className='text-2xl sm:text-3xl mb-2'>📋</p>
            <p className='text-slate-600 text-sm sm:text-base'>No invoices yet</p>
          </div>
        ) : (
          <div className='space-y-3 sm:space-y-4'>
            {invoices.map((invoice) => (
              <div
                key={invoice._id}
                className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm transition hover:shadow-md'
              >
                <div className='flex flex-col gap-4 sm:gap-5'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
                    <div className='flex-1'>
                      <div className='flex flex-wrap items-center gap-2 mb-3'>
                        <h3 className='font-bold text-slate-900 text-sm sm:text-base'>
                          Invoice #{invoice.invoiceNumber}
                        </h3>
                        <span className={`rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
                          {invoice.status.toUpperCase()}
                        </span>
                      </div>

                      <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-xs sm:text-sm text-slate-600'>
                        <div>
                          <p className='text-xs text-slate-500 font-semibold'>Doctor</p>
                          <p className='mt-1 font-medium text-slate-900 truncate'>{invoice.doctorName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-xs text-slate-500 font-semibold'>Date</p>
                          <p className='mt-1'>{new Date(invoice.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className='text-xs text-slate-500 font-semibold'>Amount</p>
                          <p className='mt-1 font-bold text-slate-900'>
                            {currencySymbol} {invoice.amount}
                          </p>
                        </div>
                      </div>

                      <div className='mt-3 text-xs text-slate-500 line-clamp-1'>
                        <p>Method: {invoice.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200'>
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className='flex-1 rounded-lg sm:rounded-xl border border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
                    >
                      View
                    </button>
                    <button
                      onClick={() => downloadInvoice(invoice._id)}
                      className='flex-1 rounded-lg sm:rounded-xl bg-primary px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90'
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INVOICE DETAIL MODAL */}
        {selectedInvoice && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-white shadow-2xl max-h-96 overflow-y-auto p-4 sm:p-6 lg:p-8'>
              <div className='mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
                <h2 className='text-xl sm:text-2xl font-bold text-slate-900 truncate'>
                  Invoice #{selectedInvoice.invoiceNumber}
                </h2>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className='text-2xl text-slate-400 transition hover:text-slate-600 self-start'
                >
                  ✕
                </button>
              </div>

              <div className='space-y-4 sm:space-y-6'>
                {/* HEADER INFO */}
                <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2'>
                  <div>
                    <p className='text-xs sm:text-sm text-slate-500 font-semibold'>Invoice Number</p>
                    <p className='mt-1 font-bold text-slate-900 text-sm sm:text-base'>{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className='text-xs sm:text-sm text-slate-500 font-semibold'>Invoice Date</p>
                    <p className='mt-1 font-bold text-slate-900 text-sm sm:text-base'>
                      {new Date(selectedInvoice.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs sm:text-sm text-slate-500 font-semibold'>Status</p>
                    <p className='mt-1 font-bold text-slate-900 capitalize text-sm sm:text-base'>{selectedInvoice.status}</p>
                  </div>
                  <div>
                    <p className='text-xs sm:text-sm text-slate-500 font-semibold'>Amount</p>
                    <p className='mt-1 font-bold text-lg sm:text-xl text-slate-900'>
                      {currencySymbol} {selectedInvoice.amount}
                    </p>
                  </div>
                </div>

                {/* SERVICES */}
                <div className='border-t border-slate-200 pt-4 sm:pt-6'>
                  <p className='text-xs sm:text-sm font-semibold text-slate-500 mb-3'>SERVICES PROVIDED</p>
                  <div className='space-y-2'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-slate-50 rounded-xl gap-2'>
                      <p className='text-slate-900 text-xs sm:text-sm break-words'>Consultation Fee</p>
                      <p className='font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap'>{currencySymbol} {selectedInvoice.amount}</p>
                    </div>
                  </div>
                </div>

                {/* DOCTOR INFO */}
                <div className='border-t border-slate-200 pt-4 sm:pt-6'>
                  <p className='text-xs sm:text-sm font-semibold text-slate-500 mb-3'>DOCTOR DETAILS</p>
                  <div className='bg-slate-50 rounded-xl p-3 sm:p-4'>
                    <p className='font-bold text-slate-900 text-sm sm:text-base'>{selectedInvoice.doctorName || 'N/A'}</p>
                    {selectedInvoice.doctorSpeciality && (
                      <p className='text-xs sm:text-sm text-slate-600'>{selectedInvoice.doctorSpeciality}</p>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-slate-200'>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className='flex-1 rounded-lg sm:rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-slate-700 transition hover:bg-slate-50 text-xs sm:text-sm'
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      downloadInvoice(selectedInvoice._id)
                      setSelectedInvoice(null)
                    }}
                    className='flex-1 rounded-lg sm:rounded-xl bg-primary px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-white transition hover:opacity-90 text-xs sm:text-sm'
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Invoices
