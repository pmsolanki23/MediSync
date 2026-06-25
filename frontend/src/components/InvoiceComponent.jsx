import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Download, Eye, FileText } from 'lucide-react'

const InvoiceComponent = ({ userId, isDarkMode }) => {
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const backendURL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (userId) {
      fetchInvoices()
      fetchStats()
    }
  }, [userId, statusFilter])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/get-invoices`,
        { userId, status: statusFilter === 'all' ? undefined : statusFilter, page: 1, limit: 10 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (data.success) {
        setInvoices(data.invoices)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/invoice-stats`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
    }
  }

  const handleViewInvoice = async (invoiceId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/get-invoice`,
        { userId, invoiceId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (data.success) {
        setSelectedInvoice(data)
      }
    } catch (error) {
    }
  }

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/download-invoice`,
        { userId, invoiceId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (data.success) {
        // Generate PDF
        const { invoice, appointment } = data
        const printWindow = window.open('', '', 'height=600,width=800')
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoice.invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                .header { text-align: center; margin-bottom: 30px; }
                .invoice-number { color: #007bff; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f8f9fa; }
                .total { font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0; }
                .status { padding: 5px 10px; border-radius: 3px; display: inline-block; }
                .status.paid { background-color: #d4edda; color: #155724; }
                .status.pending { background-color: #fff3cd; color: #856404; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>INVOICE</h1>
                <p class="invoice-number">${invoice.invoiceNumber}</p>
              </div>
              
              <table>
                <tr>
                  <td><strong>Invoice Date:</strong><br>${new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td><strong>Due Date:</strong><br>${new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td><strong>Status:</strong><br><span class="status ${invoice.status}">${invoice.status.toUpperCase()}</span></td>
                </tr>
              </table>

              <h3>Appointment Details</h3>
              <table>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
                <tr>
                  <td>Medical Appointment - ${appointment?.docData?.name}</td>
                  <td>₹${invoice.amount.toFixed(2)}</td>
                </tr>
              </table>

              <div class="total">
                Total Amount: ₹${invoice.amount.toFixed(2)}
              </div>

              <p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>
              ${invoice.paymentDate ? `<p><strong>Payment Date:</strong> ${new Date(invoice.paymentDate).toLocaleDateString()}</p>` : ''}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    } catch (error) {
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-md`}>
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <FileText size={24} />
        Payment & Invoices
      </h3>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Total Invoices</p>
            <p className="text-xl sm:text-2xl font-bold mt-2">{stats.total}</p>
          </div>

          <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Paid</p>
            <p className="text-xl sm:text-2xl font-bold mt-2 text-green-500">{stats.paid}</p>
          </div>

          <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Pending</p>
            <p className="text-xl sm:text-2xl font-bold mt-2 text-yellow-500">{stats.pending}</p>
          </div>

          <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Total Paid</p>
            <p className="text-xl sm:text-2xl font-bold mt-2">₹{stats.paidAmount.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
        {['all', 'paid', 'pending', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl capitalize transition text-xs sm:text-sm font-medium touch-manipulation ${
              statusFilter === status
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      {loading ? (
        <p className="text-center py-8 text-xs sm:text-sm">Loading invoices...</p>
      ) : invoices.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {/* Desktop Table View */}
          <div className='hidden sm:block overflow-x-auto rounded-lg sm:rounded-xl border border-gray-200'>
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold">Invoice Number</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold">Amount</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold">Date</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold">Status</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-50`}>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 font-mono">{invoice.invoiceNumber}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 font-semibold">₹{invoice.amount.toFixed(2)}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 flex gap-2">
                      <button
                        onClick={() => handleViewInvoice(invoice._id)}
                        className="text-blue-500 hover:text-blue-700 touch-manipulation"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice._id)}
                        className="text-green-500 hover:text-green-700 touch-manipulation"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className='sm:hidden space-y-3'>
            {invoices.map((invoice) => (
              <div key={invoice._id} className={`p-3 border rounded-lg ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                <div className='flex justify-between items-start mb-2'>
                  <div>
                    <p className='font-mono text-xs text-slate-500'>{invoice.invoiceNumber}</p>
                    <p className='text-lg font-bold mt-1'>₹{invoice.amount.toFixed(2)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
                <p className='text-xs text-slate-500 mb-3'>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleViewInvoice(invoice._id)}
                    className="flex-1 flex items-center justify-center gap-2 text-blue-500 hover:text-blue-700 touch-manipulation border border-blue-200 rounded-lg py-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(invoice._id)}
                    className="flex-1 flex items-center justify-center gap-2 text-green-500 hover:text-green-700 touch-manipulation border border-green-200 rounded-lg py-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className={`text-center py-8 text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          No invoices available
        </p>
      )}
    </div>
  )
}

export default InvoiceComponent
