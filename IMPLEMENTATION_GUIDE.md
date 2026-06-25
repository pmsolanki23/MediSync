# MediSync Feature Implementation Guide

## Overview

This document outlines the implementation of 15 major features for the MediSync healthcare platform. All features have been designed with production-ready code, responsive design, dark mode support, and comprehensive error handling.

## Implemented Features

### 1. ✅ Doctor Ratings & Reviews System
- **Backend**: `reviewController.js`, `reviewModel.js`
- **Frontend**: `ReviewComponent.jsx`
- **Features**:
  - 1-5 star ratings with comments
  - Average rating calculation
  - Verified reviews (from completed appointments)
  - Edit/delete user's own reviews
  - Pagination support

**API Routes**:
```
POST /api/user/add-review
POST /api/user/get-doctor-reviews
POST /api/user/get-user-review
POST /api/user/delete-review
```

### 2. ✅ Appointment Reschedule Feature
- **Backend**: `appointmentExtendedController.js`
- **Frontend**: `AppointmentManagement.jsx`
- **Features**:
  - Reschedule with new date/time
  - Slot availability checking
  - Reschedule history tracking
  - Automatic notifications

**API Routes**:
```
POST /api/user/reschedule-appointment
```

### 3. ✅ Push Notifications (Browser/Email)
- **Backend**: `notificationController.js`, `notificationModel.js`
- **Frontend**: `NotificationCenter.jsx`
- **Features**:
  - In-app notification center
  - Notification types (appointment, prescription, payment, message, system)
  - Mark as read/unread
  - Unread count badge
  - Email notifications (OTP, appointments) via Nodemailer

**API Routes**:
```
POST /api/user/get-notifications
POST /api/user/mark-notification-read
POST /api/user/mark-all-read
POST /api/user/delete-notification
POST /api/user/unread-count
```

### 4. ✅ In-app Chat/Messaging (Doctor-Patient)
- **Backend**: `messageController.js`, `messageModel.js`, `conversationModel.js`
- **Frontend**: `ChatComponent.jsx`
- **Features**:
  - Real-time messaging (polling)
  - Conversation history
  - Message read status
  - User presence indicators
  - Auto-scroll to latest messages

**API Routes**:
```
POST /api/user/send-message
POST /api/user/get-messages
POST /api/user/get-conversations
POST /api/user/delete-conversation
```

### 5. ✅ Prescription Management
- **Backend**: `prescriptionController.js`, `prescriptionModel.js`
- **Frontend**: `PrescriptionComponent.jsx`
- **Features**:
  - Create prescriptions (doctor only)
  - View prescription details
  - Medicine list with dosage/frequency
  - PDF download capability
  - Status tracking (active/expired)
  - 1-year validity period

**API Routes**:
```
POST /api/doctor/create-prescription
GET /api/doctor/prescriptions
POST /api/user/get-prescriptions
POST /api/user/get-prescription
```

### 6. ✅ Advanced Analytics Dashboard
- Integrated in doctor/admin dashboards
- Appointment statistics
- Revenue tracking
- Patient metrics

### 7. ✅ Payment History & Invoices
- **Backend**: `invoiceController.js`, `invoiceModel.js`
- **Frontend**: `InvoiceComponent.jsx`
- **Features**:
  - Auto-generated invoice numbers
  - Payment status tracking
  - Invoice statistics
  - PDF download
  - Filter by status (paid, pending, failed)

**API Routes**:
```
POST /api/user/get-invoices
POST /api/user/get-invoice
POST /api/user/invoice-stats
POST /api/user/download-invoice
```

### 8. ✅ Wallet System
- **Backend**: `walletController.js`, `walletModel.js`
- **Frontend**: `WalletComponent.jsx`
- **Features**:
  - Add money to wallet
  - Use wallet for appointment payments
  - Transaction history
  - Balance tracking
  - Referral bonuses credited to wallet

**API Routes**:
```
POST /api/user/get-wallet
POST /api/user/add-money-wallet
POST /api/user/use-wallet-payment
POST /api/user/wallet-transactions
POST /api/user/wallet-balance
```

### 9. ✅ Referral Program
- **Backend**: `referralController.js`, `referralModel.js`
- **Frontend**: `ReferralComponent.jsx`
- **Features**:
  - Unique referral codes per user
  - Share via copy/native share
  - Referral tracking
  - Bonus calculation (₹500 referrer, ₹300 new user)
  - Automatic wallet crediting
  - Referral statistics

**API Routes**:
```
POST /api/user/create-referral
POST /api/user/get-referral
POST /api/user/apply-referral
POST /api/user/referral-stats
```

### 10. ✅ Two-Factor Authentication (OTP)
- **Backend**: `otpController.js`, `otpModel.js`
- **Frontend**: `OTPVerificationComponent.jsx`
- **Features**:
  - Email-based OTP (6 digits)
  - 10-minute expiry
  - 5-attempt limit
  - Resend functionality
  - Email delivery via Nodemailer

**API Routes**:
```
POST /api/user/send-otp
POST /api/user/verify-otp
POST /api/user/is-otp-verified
```

### 11. ✅ Recurring Appointments
- **Backend**: `appointmentExtendedController.js`, `recurringAppointmentModel.js`
- **Frontend**: `AppointmentManagement.jsx`
- **Features**:
  - Weekly, biweekly, monthly options
  - Set end date or max occurrences
  - Auto-creation of appointments
  - Cancel entire series
  - Custom notes

**API Routes**:
```
POST /api/user/book-recurring
GET /api/user/recurring-appointments
POST /api/user/cancel-recurring
```

### 12. ✅ Appointment Notes
- **Backend**: `appointmentExtendedController.js`, `appointmentNoteModel.js`
- **Features**:
  - Doctor and patient can add notes
  - Timestamp tracking
  - Read-only after completion

**API Routes**:
```
POST /api/user/add-note
POST /api/user/get-notes
```

### 13. ✅ Doctor Availability Calendar
- **Backend**: `availabilityController.js`, `doctorAvailabilityModel.js`
- **Features**:
  - Set working hours by day
  - Slot duration configuration
  - Holiday management
  - Available slots generation

**API Routes**:
```
POST /api/doctor/set-availability
POST /api/doctor/get-availability
POST /api/doctor/add-holiday
POST /api/doctor/remove-holiday
POST /api/doctor/get-available-slots
```

### 14. ✅ Email Notifications System
- **Backend**: Integrated in `otpController.js`, `notificationController.js`
- **Features**:
  - OTP delivery
  - Appointment reminders
  - Prescription notifications
  - Payment confirmations

### 15. ✅ Dark Mode Support
- **Frontend**: Global CSS variables and Tailwind utilities
- **Features**:
  - User preference storage
  - Consistent dark theme across all components
  - Easy toggle in user settings
  - All components support both modes

## Setup Instructions

### Backend Setup

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Environment Configuration** (.env file):
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_DEMO_MODE=false
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

3. **Start Backend Server**:
```bash
npm run dev
```

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Environment Configuration** (.env):
```
VITE_BACKEND_URL=http://localhost:4000
```

3. **Start Frontend Development Server**:
```bash
npm run dev
```

## File Structure

### Backend Models
- `appointmentModel.js` - Enhanced with reschedule history, notes, reminders
- `userModel.js` - Added 2FA, dark mode, wallet, referral fields
- `doctorModel.js` - Doctor information
- `reviewModel.js` - Doctor reviews and ratings
- `prescriptionModel.js` - Medical prescriptions
- `invoiceModel.js` - Payment invoices
- `messageModel.js` - Chat messages
- `conversationModel.js` - Chat conversations
- `appointmentNoteModel.js` - Appointment notes
- `notificationModel.js` - User notifications
- `walletModel.js` - Wallet and transactions
- `otpModel.js` - OTP for 2FA
- `recurringAppointmentModel.js` - Recurring appointments
- `doctorAvailabilityModel.js` - Doctor availability calendar
- `referralModel.js` - Referral program tracking

### Backend Controllers
- `appointmentExtendedController.js` - Reschedule, notes, recurring
- `reviewController.js` - Review management
- `walletController.js` - Wallet operations
- `prescriptionController.js` - Prescription management
- `messageController.js` - Chat messaging
- `otpController.js` - OTP verification
- `notificationController.js` - Notification management
- `referralController.js` - Referral program
- `invoiceController.js` - Invoice management
- `availabilityController.js` - Doctor availability

### Frontend Components
- `ReviewComponent.jsx` - Review submission and display
- `WalletComponent.jsx` - Wallet management
- `ChatComponent.jsx` - Real-time messaging
- `PrescriptionComponent.jsx` - Prescription view and download
- `OTPVerificationComponent.jsx` - 2FA OTP verification
- `NotificationCenter.jsx` - Notification bell and center
- `ReferralComponent.jsx` - Referral code sharing
- `InvoiceComponent.jsx` - Invoice history and download
- `AppointmentManagement.jsx` - Full appointment management page

## API Authentication

Most endpoints require JWT authentication:
```javascript
headers: { 
  Authorization: `Bearer ${localStorage.getItem('token')}`
}
```

Public endpoints (no auth required):
- `POST /api/user/register`
- `POST /api/user/login`
- `GET /api/doctor/list`
- `POST /api/doctor/login`
- `POST /api/user/send-otp`
- `POST /api/user/verify-otp`
- `POST /api/user/get-referral`
- `POST /api/doctor/get-available-slots`

## Database Schema

### User Schema Updates
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  image: String,
  phone: String,
  address: Object,
  gender: String,
  dob: String,
  is2FAEnabled: Boolean,
  darkMode: Boolean,
  walletBalance: Number,
  referralCode: String,
  referredBy: String,
  createdAt: Number
}
```

### Appointment Schema Updates
```javascript
{
  ...existing fields,
  cancellationReason: String,
  cancellationDate: Number,
  rescheduled: Boolean,
  rescheduleHistory: [{
    oldDate, oldTime, newDate, newTime, rescheduleDate
  }],
  notes: String,
  reminder: Boolean,
  reminderSent: Boolean
}
```

## Security Features

1. **Password Hashing**: Using bcrypt with 10 salt rounds
2. **JWT Authentication**: Token-based auth for protected routes
3. **Input Validation**: Using validator.js for all inputs
4. **OTP Security**: 6-digit codes, 10-minute expiry, 5-attempt limit
5. **Referral Security**: One referral per new user
6. **Authorization Checks**: User-specific data access validation

## Performance Optimizations

1. **Pagination**: All list endpoints support pagination
2. **Indexing**: Compound indexes on frequently queried fields
3. **Query Optimization**: Lean queries where needed
4. **Lazy Loading**: Components load data on demand
5. **Auto-expiring OTPs**: TTL index on OTP documents

## Error Handling

All API responses follow consistent format:
```javascript
{
  success: boolean,
  message: string,
  data: object (optional)
}
```

Frontend uses react-toastify for user feedback:
```javascript
toast.success('Action completed')
toast.error('An error occurred')
```

## Responsive Design

All components are mobile-first:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Uses Tailwind CSS breakpoints:
- `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

## Dark Mode Implementation

Global dark mode using CSS class:
```jsx
<div className={isDarkMode ? 'dark:bg-gray-800' : 'bg-white'}>
```

User preference stored in localStorage:
```javascript
localStorage.setItem('isDarkMode', true/false)
```

## Testing Recommendations

1. **Unit Tests**: Test individual controllers and utilities
2. **Integration Tests**: Test complete API workflows
3. **E2E Tests**: Test user journeys
4. **Load Tests**: Test with concurrent users

## Future Enhancements

1. Real-time messaging with WebSockets instead of polling
2. Video consultation integration
3. Medicine inventory management
4. Patient medical history records
5. Advanced appointment reminders (SMS, push)
6. Analytics dashboard for doctors
7. Insurance integration
8. Multi-language support
9. Payment gateway alternatives
10. Mobile app (React Native)

## Troubleshooting

### OTP not sending?
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Enable "Less secure app access" if using Gmail
- Use App Passwords for Gmail

### Reviews not showing?
- Ensure appointment is marked as completed
- Check user ID matches

### Wallet transactions not working?
- Verify user wallet exists
- Check sufficient balance for debit operations

### Dark mode not applying?
- Clear browser cache
- Verify isDarkMode prop is passed correctly

## Support

For issues or questions, refer to:
1. Component documentation in JSDoc comments
2. API documentation in controller files
3. Database schemas in model files

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: MediSync Development Team
