import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContextObject'
import { Download, ChevronRight, ArrowLeft, FileText, Pill, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

const PrescriptionViewer = () => {
  const { token, backendUrl } = useContext(AppContext)
  const [prescriptions, setPrescriptions] = useState([])
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-prescriptions`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setPrescriptions(data.prescriptions)
      }
    } catch (error) {
      toast?.error('Failed to load prescriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (prescription) => {
    try {
      const element = document.createElement('div')
      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 600px;">
          <h1 style="color: #0f766e; margin-bottom: 30px; text-align: center;">Medical Prescription</h1>
          
          <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #0f766e;">
            <p><strong>Date:</strong> ${new Date(prescription.date).toLocaleDateString()}</p>
            <p><strong>Prescription ID:</strong> ${prescription._id}</p>
          </div>

          <div style="margin-bottom: 20px; padding: 15px; background: #f0f9f8; border-radius: 8px; border-left: 4px solid #0f766e;">
            <p><strong style="color: #0f766e;">Diagnosis:</strong></p>
            <p style="margin-top: 8px;">${prescription.diagnosis}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #0f766e; margin-bottom: 15px;">Medications</h3>
            ${prescription.medications.map(med => `
              <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid #0f766e; background: #f9f9f9; border-radius: 4px;">
                <p style="font-size: 16px; font-weight: bold; color: #333;">${med.name}</p>
                <div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                  <div>
                    <p style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold;">Dosage</p>
                    <p style="margin-top: 4px; font-weight: bold;">${med.dosage}</p>
                  </div>
                  <div>
                    <p style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold;">Frequency</p>
                    <p style="margin-top: 4px; font-weight: bold;">${med.frequency}</p>
                  </div>
                  <div>
                    <p style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold;">Duration</p>
                    <p style="margin-top: 4px; font-weight: bold;">${med.duration}</p>
                  </div>
                </div>
                ${med.notes ? `<p style="margin-top: 10px; font-size: 14px; color: #666;"><strong>Notes:</strong> ${med.notes}</p>` : ''}
              </div>
            `).join('')}
          </div>

          ${prescription.notes ? `
            <div style="margin-bottom: 20px; padding: 15px; background: #fff8e1; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p><strong>Additional Notes:</strong></p>
              <p style="margin-top: 8px;">${prescription.notes}</p>
            </div>
          ` : ''}

          <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 12px; text-align: center;">
            This prescription is valid until ${new Date(prescription.expiryDate).toLocaleDateString()}
          </p>
        </div>
      `

      const printWindow = window.open('', '', 'height=400,width=800')
      printWindow.document.write(element.innerHTML)
      printWindow.document.close()
      printWindow.print()
      toast.success('Prescription ready for print')
    } catch (error) {
      toast.error('Failed to download prescription')
    }
  }

  if (loading) {
    return <div className='text-center py-8 text-slate-500'>Loading prescriptions...</div>
  }

  if (!selectedPrescription) {
    return (
      <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm'>
        <div className='flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <FileText className='w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0' />
            <h2 className='text-xl sm:text-2xl font-bold text-slate-900'>My Prescriptions</h2>
          </div>
        </div>

        {prescriptions.length === 0 ? (
          <div className='text-center py-8 sm:py-12'>
            <FileText className='w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4' />
            <p className='text-slate-500 text-sm sm:text-lg'>No prescriptions yet</p>
          </div>
        ) : (
          <div className='space-y-2 sm:space-y-4'>
            {prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className='rounded-lg sm:rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-cyan-50 p-3 sm:p-5 transition hover:border-primary/30 hover:shadow-md cursor-pointer group'
                onClick={() => setSelectedPrescription(prescription)}
              >
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-bold text-slate-900 text-sm sm:text-base break-words'>{prescription.diagnosis}</h3>
                    <div className='mt-2 sm:mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm'>
                      <div className='flex items-center gap-2 text-slate-600'>
                        <Pill className='w-4 h-4 flex-shrink-0' />
                        <span>{prescription.medications.length} medications</span>
                      </div>
                      <div className='flex items-center gap-2 text-slate-600'>
                        <Clock className='w-4 h-4 flex-shrink-0' />
                        <span>{new Date(prescription.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className='text-xs text-slate-500 mt-2'>
                      Valid until: {new Date(prescription.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className='w-5 h-5 text-slate-400 group-hover:text-primary transition flex-shrink-0' />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm'>
      <button
        onClick={() => setSelectedPrescription(null)}
        className='mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary transition hover:gap-3 touch-manipulation'
      >
        <ArrowLeft className='w-4 h-4' />
        Back to Prescriptions
      </button>

      {/* Header */}
      <div className='mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='min-w-0'>
          <h1 className='text-2xl sm:text-3xl font-bold text-slate-900'>Medical Prescription</h1>
          <p className='mt-1 text-xs sm:text-sm text-slate-500'>
            Date: {new Date(selectedPrescription.date).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => handleDownload(selectedPrescription)}
          className='rounded-lg sm:rounded-xl border border-primary bg-white px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-primary transition hover:bg-primary hover:text-white flex items-center justify-center gap-2 whitespace-nowrap touch-manipulation'
        >
          <Download className='w-4 h-4' />
          Download/Print
        </button>
      </div>

      {/* Diagnosis */}
      <div className='mb-6 rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-6'>
        <div className='flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3'>
          <AlertCircle className='w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5 sm:mt-1' />
          <div className='min-w-0'>
            <p className='text-xs font-semibold uppercase text-primary mb-1 sm:mb-2'>Diagnosis</p>
            <p className='text-base sm:text-lg font-semibold text-slate-900 break-words'>{selectedPrescription.diagnosis}</p>
          </div>
        </div>
        {selectedPrescription.notes && (
          <p className='mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600 ml-6'>{selectedPrescription.notes}</p>
        )}
      </div>

      {/* Medications */}
      <div>
        <div className='flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4'>
          <Pill className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />
          <h2 className='text-lg sm:text-xl font-bold text-slate-900'>Medications</h2>
        </div>
        <div className='space-y-3 sm:space-y-4'>
          {selectedPrescription.medications.map((med, index) => (
            <div key={index} className='rounded-lg sm:rounded-xl border-l-4 border-primary bg-slate-50 p-3 sm:p-5'>
              <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4'>
                <div className='flex-1 min-w-0'>
                  <h3 className='text-base sm:text-lg font-bold text-slate-900 break-words'>{med.name}</h3>
                  <div className='mt-2 sm:mt-3 grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 text-xs sm:text-sm'>
                    <div>
                      <p className='text-xs font-semibold uppercase text-slate-500'>Dosage</p>
                      <p className='mt-1 font-semibold text-slate-900'>{med.dosage}</p>
                    </div>
                    <div>
                      <p className='text-xs font-semibold uppercase text-slate-500'>Frequency</p>
                      <p className='mt-1 font-semibold text-slate-900'>{med.frequency}</p>
                    </div>
                    <div>
                      <p className='text-xs font-semibold uppercase text-slate-500'>Duration</p>
                      <p className='mt-1 font-semibold text-slate-900'>{med.duration}</p>
                    </div>
                  </div>
                  {med.notes && (
                    <div className='mt-2 sm:mt-3'>
                      <p className='text-xs font-semibold uppercase text-slate-500'>Notes</p>
                      <p className='mt-1 text-xs sm:text-sm text-slate-600'>{med.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validity */}
      <div className='mt-6 sm:mt-8 rounded-lg sm:rounded-xl bg-yellow-50 p-3 sm:p-4 border border-yellow-200 flex items-start gap-2 sm:gap-3'>
        <AlertCircle className='w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5' />
        <p className='text-xs sm:text-sm text-yellow-800'>
          <strong>Valid until:</strong> {new Date(selectedPrescription.expiryDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default PrescriptionViewer
