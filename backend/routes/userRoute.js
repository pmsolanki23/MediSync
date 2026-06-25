import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js';
import { rescheduleAppointment, addAppointmentNote, getAppointmentNotes, bookRecurringAppointment, getRecurringAppointments, cancelRecurringAppointment } from '../controllers/appointmentExtendedController.js';
import { addReview, getDoctorReviews, getUserReviews, markHelpful } from '../controllers/reviewController.js';
import { getWallet, addFunds, useWalletForAppointment } from '../controllers/walletController.js';
import { getUserPrescriptions, getPrescription } from '../controllers/prescriptionController.js';
import { sendMessage, getMessages, getConversations, deleteConversation } from '../controllers/messageController.js';
import { sendOTP, verifyOTP, isOTPVerified } from '../controllers/otpController.js';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } from '../controllers/notificationController.js';
import { createReferral, getReferralByCode, applyReferralCode, getReferralStats } from '../controllers/referralController.js';
import { getUserInvoices, getInvoice, getInvoiceStats, downloadInvoice } from '../controllers/invoiceController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)

userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/reschedule-appointment", authUser, rescheduleAppointment)

userRouter.post("/add-note", authUser, addAppointmentNote)
userRouter.post("/get-notes", authUser, getAppointmentNotes)

userRouter.post("/book-recurring", authUser, bookRecurringAppointment)
userRouter.get("/recurring-appointments", authUser, getRecurringAppointments)
userRouter.post("/cancel-recurring", authUser, cancelRecurringAppointment)

userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)

userRouter.post("/add-review", authUser, addReview)
userRouter.post("/get-doctor-reviews", authUser, getDoctorReviews)
userRouter.post("/get-user-reviews", authUser, getUserReviews)
userRouter.post("/mark-helpful", authUser, markHelpful)

userRouter.post("/get-wallet", authUser, getWallet)
userRouter.post("/add-money-wallet", authUser, addFunds)
userRouter.post("/use-wallet-payment", authUser, useWalletForAppointment)

userRouter.post("/get-prescriptions", authUser, getUserPrescriptions)
userRouter.post("/get-prescription", authUser, getPrescription)

userRouter.post("/send-message", authUser, sendMessage)
userRouter.post("/get-messages", authUser, getMessages)
userRouter.post("/get-conversations", authUser, getConversations)
userRouter.post("/delete-conversation", authUser, deleteConversation)

userRouter.post("/send-otp", sendOTP)
userRouter.post("/verify-otp", verifyOTP)
userRouter.post("/is-otp-verified", isOTPVerified)

userRouter.post("/get-notifications", authUser, getNotifications)
userRouter.post("/mark-notification-read", authUser, markAsRead)
userRouter.post("/mark-all-read", authUser, markAllAsRead)
userRouter.post("/delete-notification", authUser, deleteNotification)
userRouter.post("/unread-count", authUser, getUnreadCount)

userRouter.post("/create-referral", authUser, createReferral)
userRouter.post("/get-referral", getReferralByCode)
userRouter.post("/apply-referral", applyReferralCode)
userRouter.post("/referral-stats", authUser, getReferralStats)

userRouter.post("/get-invoices", authUser, getUserInvoices)
userRouter.post("/get-invoice", authUser, getInvoice)
userRouter.post("/invoice-stats", authUser, getInvoiceStats)
userRouter.post("/download-invoice", authUser, downloadInvoice)

export default userRouter;
