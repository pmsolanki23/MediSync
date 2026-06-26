import React, { useState, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContextObject'
import { Plus, X, Check } from 'lucide-react'
import { toast } from 'react-toastify'

const AddPrescriptionComponent = ({ appointment, onClose, onSuccess }) => {
  const { backendUrl, token } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '', notes: '' }
  ])
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')

  const addMedicationField = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '', frequency: '', duration: '', notes: '' }
    ])
  }

  const removeMedicationField = (index) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const updateMedication = (index, field, value) => {
    const updated = [...medications]
    updated[index][field] = value
    setMedications(updated)
  }

  const handleSubmit = async () => {
    if (!diagnosis.trim()) {
      toast.error('Please enter diagnosis')
      return
    }

    const validMedications = medications.filter(m => 
      m.name.trim() && m.dosage.trim() && m.frequency.trim() && m.duration.trim()
    )

    if (validMedications.length === 0) {
      toast.error('Please add at least one medication')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/prescription/add-prescription`,
        {
          appointmentId: appointment._id,
          medications: validMedications,
          diagnosis,
          notes
        },
        { headers: { token } }
      )

      if (data.success) {
        toast.success('Prescription added successfully')
        onSuccess?.()
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to add prescription')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-2xl max-h-96 overflow-y-auto rounded-2xl bg-white shadow-2xl p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-slate-900'>Add Prescription</h2>
            <p className='text-sm text-slate-600 mt-1'>
              Patient: {appointment.userData?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 transition'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Diagnosis */}
        <div className='mb-6'>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Diagnosis *
          </label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder='Enter diagnosis (e.g., Hypertension, Fever, etc.)'
            className='w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-primary focus:outline-none transition'
            rows='3'
          />
        </div>

        {/* Medications */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-3'>
            <label className='block text-sm font-semibold text-slate-700'>
              Medications *
            </label>
            <button
              onClick={addMedicationField}
              className='flex items-center gap-1 text-primary text-sm font-semibold hover:opacity-80 transition'
            >
              <Plus className='w-4 h-4' />
              Add Medication
            </button>
          </div>

          <div className='space-y-3 max-h-48 overflow-y-auto'>
            {medications.map((med, index) => (
              <div key={index} className='p-4 border border-slate-200 rounded-lg bg-slate-50'>
                <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 mb-3'>
                  <input
                    type='text'
                    placeholder='Medicine name *'
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    className='w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
                  />
                  <input
                    type='text'
                    placeholder='Dosage (e.g., 500mg) *'
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    className='w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
                  />
                </div>
                <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 mb-3'>
                  <input
                    type='text'
                    placeholder='Frequency (e.g., 2x daily) *'
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    className='w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
                  />
                  <input
                    type='text'
                    placeholder='Duration (e.g., 7 days) *'
                    value={med.duration}
                    onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    className='w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
                  />
                </div>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    placeholder='Notes (optional)'
                    value={med.notes}
                    onChange={(e) => updateMedication(index, 'notes', e.target.value)}
                    className='flex-1 rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
                  />
                  {medications.length > 1 && (
                    <button
                      onClick={() => removeMedicationField(index)}
                      className='text-red-600 hover:text-red-700 transition'
                    >
                      <X className='w-5 h-5' />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className='mb-6'>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Any additional instructions or notes for the patient (optional)'
            className='w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-primary focus:outline-none transition'
            rows='2'
          />
        </div>

        {/* Actions */}
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2'
          >
            {loading ? 'Adding...' : (
              <>
                <Check className='w-4 h-4' />
                Add Prescription
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddPrescriptionComponent
