import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Download, Calendar, FileText } from 'lucide-react'

const PrescriptionComponent = ({ userId, isDarkMode }) => {
  const [prescriptions, setprescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('active')

  const backendURL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (userId) {
      fetchPrescriptions()
    }
  }, [userId, selectedStatus])

  const fetchPrescriptions = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/get-prescriptions`,
        { userId, status: selectedStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (data.success) {
        setprescriptions(data.prescriptions)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPrescription = async (prescriptionId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/get-prescription`,
        { userId, prescriptionId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (data.success) {
        // In real implementation, this would generate and download a PDF
        const prescriptionData = data.prescription
        const printWindow = window.open('', '', 'height=600,width=800')
        printWindow.document.write(`
          <html>
            <head>
              <title>Prescription</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h2 { color: #333; }
                .medicine { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              </style>
            </head>
            <body>
              <h2>Medical Prescription</h2>
              <p><strong>Date:</strong> ${new Date(prescriptionData.date).toLocaleDateString()}</p>
              <p><strong>Diagnosis:</strong> ${prescriptionData.diagnosis}</p>
              <h3>Medicines</h3>
              <table>
                <tr>
                  <th>Medicine Name</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                </tr>
                ${prescriptionData.medicines.map(m => `
                  <tr>
                    <td>${m.name}</td>
                    <td>${m.dosage}</td>
                    <td>${m.frequency}</td>
                    <td>${m.duration}</td>
                  </tr>
                `).join('')}
              </table>
              <p><strong>Notes:</strong> ${prescriptionData.notes}</p>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    } catch (error) {
    }
  }

  return (
    <div className={`p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
        <FileText size={24} className="sm:w-7 sm:h-7" />
        My Prescriptions
      </h3>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
        {['active', 'expired', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium capitalize transition ${
              selectedStatus === status
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Prescriptions List */}
      {loading ? (
        <p className="text-center py-8 text-sm sm:text-base">Loading prescriptions...</p>
      ) : prescriptions.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className={`p-4 sm:p-5 lg:p-6 border rounded-lg sm:rounded-xl transition ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-900 hover:border-gray-600'
                  : 'border-gray-200 bg-gray-50 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-1">
                  <p className="font-semibold text-base sm:text-lg">Diagnosis: {prescription.diagnosis}</p>
                  <p className={`text-xs sm:text-sm flex items-center gap-1 mt-1 sm:mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Calendar size={14} className="sm:w-4 sm:h-4" />
                    {new Date(prescription.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  prescription.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {prescription.status}
                </span>
              </div>

              <div className="mb-4 sm:mb-5">
                <h4 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">Medicines:</h4>
                <div className="space-y-1.5 sm:space-y-2 sm:ml-4">
                  {prescription.medicines.map((med, idx) => (
                    <p key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      • <strong>{med.name}</strong> - {med.dosage} ({med.frequency}) for {med.duration}
                    </p>
                  ))}
                </div>
              </div>

              {prescription.notes && (
                <p className={`text-xs sm:text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>Notes:</strong> {prescription.notes}
                </p>
              )}

              <button
                onClick={() => handleDownloadPrescription(prescription._id)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition text-xs sm:text-sm font-medium"
              >
                <Download size={16} className="sm:w-4 sm:h-4" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-center py-8 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          No prescriptions available
        </p>
      )}
    </div>
  )
}

export default PrescriptionComponent
