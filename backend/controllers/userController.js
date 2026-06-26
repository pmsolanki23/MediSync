import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary'  
import razorpay from 'razorpay';
import crypto from 'crypto';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // Create notification for user
        const notificationModel = (await import("../models/notificationModel.js")).default;
        
        await notificationModel.create({
            userId,
            title: "Appointment Booked Successfully",
            message: `Your appointment with Dr. ${docData.name} is scheduled for ${slotDate} at ${slotTime}. Please complete the payment to confirm.`,
            type: "appointment",
            relatedId: newAppointment._id,
            isRead: false,
            createdAt: Date.now()
        });

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // Create notification for user
        const notificationModel = (await import("../models/notificationModel.js")).default;
        
        await notificationModel.create({
            userId,
            title: "Appointment Cancelled",
            message: `Your appointment with Dr. ${doctorData.name} scheduled for ${slotDate} has been cancelled.`,
            type: "appointment",
            relatedId: appointmentId,
            isRead: false,
            createdAt: Date.now()
        });

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const isRazorpayDemoMode = () => process.env.RAZORPAY_DEMO_MODE === 'true'

const paymentRazorpay = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        if (appointmentData.payment) {
            return res.json({ success: false, message: 'Appointment already paid' })
        }

        if (isRazorpayDemoMode()) {
            return res.json({
                success: true,
                demo: true,
                order: {
                    id: `demo_order_${appointmentId}`,
                    amount: Math.round(Number(appointmentData.amount) * 100),
                    currency: process.env.CURRENCY || 'INR',
                    receipt: appointmentId,
                },
                message: 'Demo payment ready'
            })
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.json({ success: false, message: 'Razorpay keys are not configured' })
        }

        const options = {
            amount: Math.round(Number(appointmentData.amount) * 100),
            currency: process.env.CURRENCY || 'INR',
            receipt: appointmentId,
        }

        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { userId, appointmentId, demo, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if (demo && isRazorpayDemoMode()) {
            const appointmentData = await appointmentModel.findById(appointmentId)

            if (!appointmentData || appointmentData.userId !== userId || appointmentData.cancelled) {
                return res.json({ success: false, message: 'Invalid appointment for this payment' })
            }

            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            
            // Create invoice for demo payment
            const invoiceModel = await import("../models/invoiceModel.js").then(m => m.default);
            const generateInvoiceNumber = () => {
                const date = new Date();
                const timestamp = date.getTime().toString().slice(-6);
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${timestamp}-${random}`;
            };
            
            await invoiceModel.create({
                appointmentId,
                userId,
                docId: appointmentData.docId,
                invoiceNumber: generateInvoiceNumber(),
                amount: appointmentData.amount,
                paymentMethod: 'razorpay',
                status: 'paid',
                issueDate: Date.now(),
                dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000
            });
            
            return res.json({ success: true, message: "Demo Payment Successful" })
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: 'Payment verification details missing' })
        }

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if (generatedSignature !== razorpay_signature) {
            return res.json({ success: false, message: 'Payment verification failed' })
        }

        const razorpayInstance = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        const appointmentData = await appointmentModel.findById(orderInfo.receipt)

        if (!appointmentData || appointmentData.userId !== userId || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Invalid appointment for this payment' })
        }

        await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
        
        // Create invoice after successful payment
        const invoiceModel = await import("../models/invoiceModel.js").then(m => m.default);
        const generateInvoiceNumber = () => {
            const date = new Date();
            const timestamp = date.getTime().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${timestamp}-${random}`;
        };
        
        await invoiceModel.create({
            appointmentId: orderInfo.receipt,
            userId,
            docId: appointmentData.docId,
            invoiceNumber: generateInvoiceNumber(),
            amount: appointmentData.amount,
            paymentMethod: 'razorpay',
            status: 'paid',
            issueDate: Date.now(),
            dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000
        });
        
        res.json({ success: true, message: "Payment Successful" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay}
