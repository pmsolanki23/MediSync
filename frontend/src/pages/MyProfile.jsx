import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContextObject'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import WalletComponent from '../components/WalletComponent'
import PrescriptionViewer from '../components/PrescriptionViewer'
import ReferralComponent from '../components/ReferralComponent'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    const {
        token,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData
    } = useContext(AppContext)

    const updateUserProfileData = async () => {

        try {

            const formData = new FormData()

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(
                backendUrl + '/api/user/update-profile',
                formData,
                { headers: { token } }
            )

            if (data.success) {

                toast.success(data.message)

                await loadUserProfileData()

                setIsEdit(false)
                setImage(false)

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            toast.error(error.message)

        }
    }

    return userData ? (

        <div className='min-h-screen bg-[#f5f9ff] py-5 sm:py-10'>

            {/* TAB NAVIGATION */}
            <div className='mb-6 sm:mb-8 flex gap-1 sm:gap-2 overflow-x-auto rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-1.5 sm:p-2 lg:p-4 shadow-sm mx-3 sm:mx-6 lg:mx-auto lg:max-w-6xl'>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm whitespace-nowrap ${
                        activeTab === 'profile'
                            ? 'bg-primary text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    👤 Profile
                </button>
                <button
                    onClick={() => setActiveTab('wallet')}
                    className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm whitespace-nowrap ${
                        activeTab === 'wallet'
                            ? 'bg-primary text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    💳 Wallet
                </button>
                <button
                    onClick={() => setActiveTab('prescriptions')}
                    className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm whitespace-nowrap ${
                        activeTab === 'prescriptions'
                            ? 'bg-primary text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    📋 Prescriptions
                </button>
                <button
                    onClick={() => setActiveTab('referrals')}
                    className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm whitespace-nowrap ${
                        activeTab === 'referrals'
                            ? 'bg-primary text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    🎁 Referrals
                </button>
            </div>

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
            <div className='mx-auto max-w-7xl rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-5 lg:p-8 shadow-sm px-3 sm:px-6'>

                {/* TOP SECTION */}
                <div className='flex flex-col gap-6 sm:gap-8 lg:gap-10 lg:flex-row'>

                    {/* LEFT PROFILE */}
                    <div className='w-full lg:w-[320px] flex-shrink-0'>

                        <div className='rounded-2xl sm:rounded-3xl border border-slate-100 bg-gradient-to-b from-cyan-50 to-white p-4 sm:p-5 lg:p-8 shadow-sm'>

                            {/* IMAGE */}
                            <div className='flex justify-center'>

                                {
                                    isEdit ? (

                                        <label htmlFor='image' className='relative cursor-pointer'>

                                            <img
                                                className='h-32 w-32 sm:h-40 sm:w-40 rounded-2xl sm:rounded-3xl object-cover shadow-lg'
                                                src={
                                                    image
                                                        ? URL.createObjectURL(image)
                                                        : userData.image
                                                }
                                                alt=''
                                            />

                                            <div className='absolute bottom-2 right-2 sm:bottom-3 sm:right-3 rounded-full bg-cyan-600 p-2 sm:p-3 shadow-lg'>

                                                <img
                                                    className='w-4 sm:w-5'
                                                    src={assets.upload_icon}
                                                    alt=''
                                                />

                                            </div>

                                            <input
                                                onChange={(e) =>
                                                    setImage(e.target.files[0])
                                                }
                                                type='file'
                                                id='image'
                                                hidden
                                            />

                                        </label>

                                    ) : (

                                        <img
                                            className='h-32 w-32 sm:h-40 sm:w-40 rounded-2xl sm:rounded-3xl object-cover shadow-lg'
                                            src={userData.image}
                                            alt=''
                                        />

                                    )
                                }

                            </div>

                            {/* NAME */}
                            <div className='mt-5 sm:mt-6 text-center'>

                                {
                                    isEdit ? (

                                        <input
                                            type='text'
                                            value={userData.name}
                                            onChange={(e) =>
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))
                                            }
                                            className='w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xl sm:text-2xl font-bold outline-none focus:border-cyan-500 transition'
                                        />

                                    ) : (

                                        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800'>
                                            {userData.name}
                                        </h2>

                                    )
                                }

                                <p className='mt-2 text-xs sm:text-sm text-slate-500'>
                                    Patient Profile
                                </p>

                            </div>

                            {/* QUICK STATS */}
                            <div className='mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4'>

                                <div className='rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 text-center shadow-sm'>

                                    <h3 className='text-xl sm:text-2xl font-bold text-cyan-600'>
                                        24/7
                                    </h3>

                                    <p className='mt-1 text-xs sm:text-sm text-slate-500'>
                                        Support
                                    </p>

                                </div>

                                <div className='rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 text-center shadow-sm'>

                                    <h3 className='text-xl sm:text-2xl font-bold text-cyan-600'>
                                        100%
                                    </h3>

                                    <p className='mt-1 text-xs sm:text-sm text-slate-500'>
                                        Secure
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT DETAILS */}
                    <div className='flex-1'>

                        {/* CONTACT INFO */}
                        <div className='rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-4 sm:p-5 lg:p-8 shadow-sm'>

                            <div className='mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between'>

                                <div>

                                    <h2 className='text-xl sm:text-2xl font-bold text-slate-800'>
                                        Personal Information
                                    </h2>

                                    <p className='mt-1 text-xs sm:text-sm text-slate-500'>
                                        Manage your personal details and account.
                                    </p>

                                </div>

                                {
                                    isEdit ? (

                                        <button
                                            onClick={updateUserProfileData}
                                            className='rounded-xl sm:rounded-2xl bg-cyan-600 px-4 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition hover:bg-cyan-700 whitespace-nowrap'
                                        >
                                            Save Changes
                                        </button>

                                    ) : (

                                        <button
                                            onClick={() => setIsEdit(true)}
                                            className='rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-4 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 whitespace-nowrap'
                                        >
                                            Edit Profile
                                        </button>

                                    )
                                }

                            </div>

                            {/* INFO GRID */}
                            <div className='grid gap-6 sm:gap-8 md:grid-cols-2'>

                                {/* EMAIL */}
                                <div>

                                    <label className='mb-2 block text-xs sm:text-sm font-medium text-slate-500'>
                                        Email Address
                                    </label>

                                    <div className='rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 break-all'>
                                        {userData.email}
                                    </div>

                                </div>

                                {/* PHONE */}
                                <div>

                                    <label className='mb-2 block text-xs sm:text-sm font-medium text-slate-500'>
                                        Phone Number
                                    </label>

                                    {
                                        isEdit ? (

                                            <input
                                                type='text'
                                                value={userData.phone}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        phone: e.target.value
                                                    }))
                                                }
                                                className='w-full rounded-xl sm:rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm outline-none focus:border-cyan-500 transition'
                                            />

                                        ) : (

                                            <div className='rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-700'>
                                                {userData.phone}
                                            </div>

                                        )
                                    }

                                </div>

                                {/* GENDER */}
                                <div>

                                    <label className='mb-2 block text-xs sm:text-sm font-medium text-slate-500'>
                                        Gender
                                    </label>

                                    {
                                        isEdit ? (

                                            <select
                                                value={userData.gender}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        gender: e.target.value
                                                    }))
                                                }
                                                className='w-full rounded-xl sm:rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm outline-none focus:border-cyan-500 transition'
                                            >
                                                <option value='Male'>Male</option>
                                                <option value='Female'>Female</option>
                                                <option value='Not Selected'>
                                                    Not Selected
                                                </option>
                                            </select>

                                        ) : (

                                            <div className='rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-700'>
                                                {userData.gender}
                                            </div>

                                        )
                                    }

                                </div>

                                {/* DOB */}
                                <div>

                                    <label className='mb-2 block text-xs sm:text-sm font-medium text-slate-500'>
                                        Date of Birth
                                    </label>

                                    {
                                        isEdit ? (

                                            <input
                                                type='date'
                                                value={userData.dob}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        dob: e.target.value
                                                    }))
                                                }
                                                className='w-full rounded-xl sm:rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm outline-none focus:border-cyan-500 transition'
                                            />

                                        ) : (

                                            <div className='rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-700'>
                                                {userData.dob}
                                            </div>

                                        )
                                    }

                                </div>

                            </div>

                        </div>

                        {/* ADDRESS SECTION */}
                        <div className='mt-4 sm:mt-6 lg:mt-8 rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-4 sm:p-5 lg:p-8 shadow-sm'>

                            <h2 className='text-xl sm:text-2xl font-bold text-slate-800'>
                                Address Information
                            </h2>

                            <p className='mt-1 text-xs sm:text-sm text-slate-500'>
                                Update your current residential address.
                            </p>

                            <div className='mt-6 sm:mt-8 grid gap-4 sm:gap-6'>

                                {
                                    isEdit ? (

                                        <>
                                            <input
                                                type='text'
                                                placeholder='Address Line 1'
                                                value={userData.address?.line1 || ''}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        address: {
                                                            ...(prev.address || {}),
                                                            line1: e.target.value
                                                        }
                                                    }))
                                                }
                                                className='w-full rounded-xl sm:rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm outline-none focus:border-cyan-500 transition'
                                            />

                                            <input
                                                type='text'
                                                placeholder='Address Line 2'
                                                value={userData.address?.line2 || ''}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        address: {
                                                            ...(prev.address || {}),
                                                            line2: e.target.value
                                                        }
                                                    }))
                                                }
                                                className='w-full rounded-xl sm:rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm outline-none focus:border-cyan-500 transition'
                                            />
                                        </>

                                    ) : (

                                        <div className='rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-5 text-xs sm:text-sm text-slate-700 leading-6 sm:leading-7'>

                                            {userData.address?.line1 || 'No Address'}

                                            <br />

                                            {userData.address?.line2}

                                        </div>

                                    )
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            )}

            {/* WALLET TAB */}
            {activeTab === 'wallet' && (
            <div className='mx-auto max-w-7xl px-3 sm:px-6'>
                <WalletComponent />
            </div>
            )}

            {/* PRESCRIPTIONS TAB */}
            {activeTab === 'prescriptions' && (
            <div className='mx-auto max-w-7xl px-3 sm:px-6'>
                <PrescriptionViewer />
            </div>
            )}

            {/* REFERRALS TAB */}
            {activeTab === 'referrals' && (
            <div className='mx-auto max-w-7xl px-3 sm:px-6'>
                <ReferralComponent />
            </div>
            )}

        </div>

    ) : null
}

export default MyProfile
