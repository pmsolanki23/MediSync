import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'

const inputClass = 'mt-2 w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary'

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!backendUrl) {
      toast.info('Set VITE_BACKEND_URL to add doctors.')
      return
    }
    if (!docImg) return toast.error('Image not selected')

    try {
      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { headers: { aToken } })
      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
      console.error(error)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='space-y-5'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>Doctor onboarding</p>
        <h1 className='mt-2 text-3xl font-semibold text-slate-950'>Add doctor</h1>
      </div>

      <section className='max-h-none max-w-5xl overflow-y-visible rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:max-h-[78vh] md:overflow-y-auto lg:p-8'>
        <div className='mb-8 flex flex-col items-start gap-4 rounded-[8px] bg-[#f7fbfa] p-4 text-slate-500 sm:flex-row sm:items-center'>
          <label htmlFor="doc-img" className='cursor-pointer'>
            <img className='h-20 w-20 rounded-full bg-white object-cover ring-1 ring-slate-200' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p className='text-sm'>Upload doctor picture</p>
        </div>

        <div className='grid gap-5 lg:grid-cols-2'>
          <label className='text-sm font-medium text-slate-700'>Doctor name<input onChange={e => setName(e.target.value)} value={name} className={inputClass} type="text" placeholder='Name' required /></label>
          <label className='text-sm font-medium text-slate-700'>Doctor email<input onChange={e => setEmail(e.target.value)} value={email} className={inputClass} type="email" placeholder='Email' required /></label>
          <label className='text-sm font-medium text-slate-700'>Set password<input onChange={e => setPassword(e.target.value)} value={password} className={inputClass} type="password" placeholder='Password' required /></label>
          <label className='text-sm font-medium text-slate-700'>Experience<select onChange={e => setExperience(e.target.value)} value={experience} className={inputClass}>{['1 Year', '2 Year', '3 Year', '4 Year', '5 Year', '6 Year', '8 Year', '9 Year', '10 Year'].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className='text-sm font-medium text-slate-700'>Fees<input onChange={e => setFees(e.target.value)} value={fees} className={inputClass} type="number" placeholder='Doctor fees' required /></label>
          <label className='text-sm font-medium text-slate-700'>Speciality<select onChange={e => setSpeciality(e.target.value)} value={speciality} className={inputClass}>{['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className='text-sm font-medium text-slate-700'>Degree<input onChange={e => setDegree(e.target.value)} value={degree} className={inputClass} type="text" placeholder='Degree' required /></label>
          <div className='space-y-3 text-sm font-medium text-slate-700'>Address<input onChange={e => setAddress1(e.target.value)} value={address1} className={inputClass} type="text" placeholder='Address 1' required /><input onChange={e => setAddress2(e.target.value)} value={address2} className={inputClass} type="text" placeholder='Address 2' required /></div>
        </div>

        <label className='mt-5 block text-sm font-medium text-slate-700'>About Doctor<textarea onChange={e => setAbout(e.target.value)} value={about} className={inputClass} rows={5} placeholder='Write about doctor' required /></label>

        <button type='submit' className='mt-6 w-full rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-950 sm:w-auto'>Add doctor</button>
      </section>
    </form>
  )
}

export default AddDoctor
