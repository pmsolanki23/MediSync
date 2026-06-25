import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const fieldClass = 'rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary'

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
    const { currency } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {
        if (!backendUrl) {
            toast.info('Set VITE_BACKEND_URL to update profile.')
            return
        }

        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, {
                headers: { Authorization: `Bearer ${dToken}` }
            })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    useEffect(() => {
        if (dToken) getProfileData()
    }, [dToken])

    if (!profileData) {
        return <div className='rounded-[8px] border border-slate-200 bg-white p-8 text-center text-slate-500'>Loading profile...</div>
    }

    return (
        <div className='space-y-5'>
            <div>
                <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>Doctor profile</p>
                <h1 className='mt-2 text-3xl font-semibold text-slate-950'>{profileData.name}</h1>
            </div>

            <section className='grid max-w-5xl gap-6 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[280px_1fr]'>
                <img className='h-72 w-full rounded-[8px] bg-teal-50 object-cover object-top sm:h-80' src={profileData.image} alt={profileData.name} />

                <div className='space-y-6'>
                    <div>
                        <p className='break-words text-2xl font-semibold text-slate-950'>{profileData.name}</p>
                        <p className='mt-1 text-sm text-slate-500'>{profileData.degree} - {profileData.speciality}</p>
                        <span className='mt-3 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-primary'>{profileData.experience}</span>
                    </div>

                    <div>
                        <p className='mb-2 text-sm font-semibold text-slate-950'>About</p>
                        {isEdit
                            ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} className={`${fieldClass} w-full`} rows={7} value={profileData.about} />
                            : <p className='max-w-3xl text-sm leading-7 text-slate-500'>{profileData.about}</p>}
                    </div>

                    <div className='grid gap-4 md:grid-cols-2'>
                        <div className='rounded-[8px] bg-[#f7fbfa] p-4'>
                            <p className='text-xs uppercase text-slate-500'>Appointment fee</p>
                            <div className='mt-2 font-semibold text-slate-950'>
                                {currency} {isEdit ? <input type='number' className={`${fieldClass} w-32 bg-white`} onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fees}
                            </div>
                        </div>

                        <div className='rounded-[8px] bg-[#f7fbfa] p-4'>
                            <p className='text-xs uppercase text-slate-500'>Availability</p>
                            <label className='mt-3 flex items-center gap-2 text-sm text-slate-700'>
                                <input type="checkbox" className='h-4 w-4 accent-primary' onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} />
                                Available for appointments
                            </label>
                        </div>
                    </div>

                    <div>
                        <p className='mb-2 text-sm font-semibold text-slate-950'>Address</p>
                        {isEdit ? (
                            <div className='grid gap-3'>
                                <input type='text' className={fieldClass} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} />
                                <input type='text' className={fieldClass} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} />
                            </div>
                        ) : (
                            <p className='text-sm leading-6 text-slate-500'>{profileData.address.line1}<br />{profileData.address.line2}</p>
                        )}
                    </div>

                    {isEdit
                        ? <button onClick={updateProfile} className='w-full rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-950 sm:w-auto'>Save profile</button>
                        : <button onClick={() => setIsEdit(true)} className='w-full rounded-full border border-primary px-7 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white sm:w-auto'>Edit profile</button>}
                </div>
            </section>
        </div>
    )
}

export default DoctorProfile
