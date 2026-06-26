import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContextObject'
import { Download, FileText, Pill, Calendar, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

const PrescriptionComponent = ({ isDarkMode }) => {
  const { backendUrl, token, currencySymbol, userData } = useContext(AppContext)
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  useEffect(() => {
    if (userData?._id) {
      fetchPrescriptions()
    }
  }, [userData])

  const fetchPrescriptions = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-prescriptions`,
        { userId: userData._id },
        { headers: { token } }
      )
      if (data.success) {
        setPrescriptions(data.prescriptions)
      }
    } catch (error) {
      toast.error('Failed to load prescriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPrescription = (prescription) => {
    try {
      const printContent = `
        <html>
          <head>
            <title>Prescription</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                background: #f5f5f5;
              }
              .container {
                background: white;
                max-width: 800px;
                margin: auto;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 {
                color: #0f766e;
                text-align: center;
                margin-bottom: 30px;
              }
              h2 {
                color: #0f766e;
                border-bottom: 2px solid #0f766e;
                padding-bottom: 10px;
                margin-top: 20px;
              }
              .info-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
              }
              .info-item {
                margin-bottom: 10px;
              }
              .label {
                font-weight: bold;
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
              }
              .value {
                color: #333;
                margin-top: 5px;
                font-size: 16px;
              }
              .diagnosis-box {
                background: #f0f9f8;
                border-left: 4px solid #0f766e;
                padding: 15px;
                margin-bottom: 20px;
              }
              .medication {
                border-left: 4px solid #0f766e;
                padding: 15px;
                margin-bottom: 15px;
                background: #f9f9f9;
              }
              .med-name {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 10px;
              }
              .med-details {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 10px;
                font-size: 13px;
              }
              .med-detail {
                margin-bottom: 5px;
              }
              .detail-label {
                font-weight: bold;
                color: #0f766e;
                font-size: 11px;
              }
              .detail-value {
                color: #333;
              }
              .validity {
                background: #fff8e1;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin-top: 20px;
                color: #856404;
              }
              .doctor-info {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #eee;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Medical Prescription</h1>
              
              <div class="info-row">
                <div class="info-item">
                  <div class="label">Date Issued</div>
                  <div class="value">${new Date(prescription.date).toLocaleDateString()}</div>
                </div>
                <div class="info-item">
                  <div class="label">Doctor</div>
                  <div class="value">${prescription.doctorName}</div>
                </div>
              </div>

              <div class="diagnosis-box">
                <div class="label">Diagnosis</div>
                <div class="value">${prescription.diagnosis}</div>
              </div>

              <h2>Medications</h2>
              ${prescription.medications.map(med => `
                <div class="medication">
                  <div class="med-name">${med.name}</div>
                  <div class="med-details">
                    <div class="med-detail">
                      <div class="detail-label">Dosage</div>
                      <div class="detail-value">${med.dosage}</div>
                    </div>
                    <div class="med-detail">
                      <div class="detail-label">Frequency</div>
                      <div class="detail-value">${med.frequency}</div>
                    </div>
                    <div class="med-detail">
                      <div class="detail-label">Duration</div>
                      <div class="detail-value">${med.duration}</div>
                    </div>
                  </div>
                  ${med.notes ? `<div style="margin-top: 10px; color: #666;"><strong>Notes:</strong> ${med.notes}</div>` : ''}
                </div>
              `).join('')}

              ${prescription.notes ? `
                <div style="background: #f5f5f5; padding: 15px; margin-top: 20px; border-radius: 4px;">
                  <div class="label">Additional Notes</div>
                  <div class="value">${prescription.notes}</div>
                </div>
              ` : ''}

              <div class="validity">
                <strong>Valid until:</strong> ${new Date(prescription.expiryDate).toLocaleDateString()}
              </div>

              <div class="doctor-info">
                <div class="info-item">
                  <div class="label">Prescribed By</div>
                  <div class="value">${prescription.doctorName} (${prescription.doctorSpeciality})</div>
                </div>
              </div>

              <div class="footer">
                <p>This prescription is valid for 90 days from the issue date.</p>
                <p>Please consult your doctor if you have any questions.</p>
              </div>
            </div>
          </body>
        </html>
      `

      const printWindow = window.open('', '', 'height=600,width=800')
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
      toast.success('Prescription ready for print')
    } catch (error) {
      toast.error('Failed to download prescription')
    }
  }

  if (loading) {
    return (
      <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm'>
        <p className='text-center py-8 text-slate-500 text-sm'>Loading prescriptions...</p>
      </div>
    )
  }

  return (
    <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm'>
      <div className='flex items-center gap-3 mb-6'>
        <FileText className='w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0' />
        <h2 className='text-lg sm:text-xl lg:text-2xl font-bold text-slate-900'>My Prescriptions</h2>
      </div>

      {prescriptions.length === 0 ? (
        <div className='text-center py-12'>
          <FileText className='w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4' />
          <p className='text-slate-500 text-sm sm:text-base'>No prescriptions yet</p>
        </div>
      ) : (
        <div className='space-y-3 sm:space-y-4'>
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className='rounded-lg sm:rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-4 sm:p-5 transition hover:border-primary/30 hover:shadow-md'
            >
              <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-bold text-slate-900 text-sm sm:text-base break-words'>
                    {prescription.diagnosis}
                  </h3>
                  <div className='mt-3 sm:mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm'>
                    <div className='flex items-center gap-2 text-slate-600'>
                      <Pill className='w-4 h-4 flex-shrink-0' />
                      <span>{prescription.medications.length} medications</span>
                    </div>
                    <div className='flex items-center gap-2 text-slate-600'>
                      <Calendar className='w-4 h-4 flex-shrink-0' />
                      <span>{new Date(prescription.date).toLocaleDateString()}</span>
                    </div>
                    <div className='text-slate-600 text-xs sm:text-sm'>
                      Dr. {prescription.doctorName}
                    </div>
                  </div>
                  <p className='text-xs text-slate-500 mt-2'>
                    Valid until: {new Date(prescription.expiryDate).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadPrescription(prescription)}
                  className='rounded-lg sm:rounded-xl bg-primary px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2 whitespace-nowrap'
                >
                  <Download className='w-4 h-4' />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PrescriptionComponent
