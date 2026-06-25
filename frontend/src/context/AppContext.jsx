import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { doctors as seededDoctors } from '../assets/assets'
import { AppContext } from './AppContextObject'

const AppContextProvider = (props) => {
    const currencySymbol = 'Rs.'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState(seededDoctors)
    const [loadingDoctors, setLoadingDoctors] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(false)

    const getDoctorsData = useCallback(async () => {
        if (!backendUrl) {
            setDoctors(seededDoctors)
            return
        }

        try {
            setLoadingDoctors(true)
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors.length ? data.doctors : seededDoctors)
            } else {
                setDoctors(seededDoctors)
                toast.error(data.message)
            }
        } catch (error) {
            setDoctors(seededDoctors)
            toast.info('Showing demo doctors until the server is available.')
        } finally {
            setLoadingDoctors(false)
        }
    }, [backendUrl])

    const loadUserProfileData = useCallback(async () => {
        if (!backendUrl || !token) return

        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: { token }
            })

            if (data.success) {
                const safeUserData = {
                    ...data.userData,
                    address: data.userData.address || { line1: '', line2: '' },
                    gender: data.userData.gender || '',
                    dob: data.userData.dob || ''
                }
                setUserData(safeUserData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [backendUrl, token])

    useEffect(() => {
        getDoctorsData()
    }, [getDoctorsData])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token, loadUserProfileData])

    const value = {
        doctors, getDoctorsData, loadingDoctors,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
