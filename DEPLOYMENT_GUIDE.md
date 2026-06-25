# MediSync Deployment & Testing Guide

## 🚀 Quick Start (5 Minutes)

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
```
✅ Backend ready at: http://localhost:4000

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend ready at: http://localhost:5173

### Terminal 3: Admin
```bash
cd admin
npm install
npm run dev
```
✅ Admin ready at: http://localhost:5174

## 📋 Pre-Deployment Checklist

- [ ] All terminals running without errors
- [ ] Backend logs show "Server started on PORT:4000"
- [ ] Frontend builds successfully
- [ ] Admin dashboard loads
- [ ] No console errors in browser DevTools

## 🧪 Testing Workflow

### 1. User Registration & Login
1. Go to http://localhost:5173
2. Click "Create Account" 
3. Register with email and password
4. Login with credentials
5. Profile should load

**Expected:** ✅ Token stored, user data loaded

### 2. Browse Doctors
1. Click "Doctors" in navbar
2. See list of doctors
3. Click on a doctor card
4. View doctor profile

**Expected:** ✅ Doctor details display, availability visible

### 3. Book Appointment
1. On doctor profile, click "Book Appointment"
2. Select date and time
3. Click "Book Appointment"
4. See confirmation

**Expected:** ✅ Appointment created, appears in "My Appointments"

### 4. Make Payment
1. Go to "My Appointments"
2. Click "Pay Online" on pending appointment
3. See Razorpay button
4. Click to process payment (demo mode)

**Expected:** ✅ Payment shows as "Paid Successfully"

### 5. Reschedule Appointment
1. On paid appointment, click "Reschedule"
2. Select new date and time
3. Confirm reschedule

**Expected:** ✅ Appointment updated with new date/time

### 6. Download Invoice
1. Click "Download Invoice" on paid appointment
2. PDF downloads

**Expected:** ✅ Invoice PDF generated

### 7. View Prescriptions
1. Go to "My Profile"
2. Click "Prescriptions" tab
3. View prescription list

**Expected:** ✅ Prescriptions load (if doctor has added any)

### 8. Wallet Management
1. Go to "My Profile"
2. Click "Wallet" tab
3. Add funds (test amount)
4. View balance and transactions

**Expected:** ✅ Wallet balance updates, transactions recorded

### 9. Messages
1. Go to "Messages" (from profile dropdown)
2. View conversation list
3. Click to open conversation
4. Send test message

**Expected:** ✅ Message appears in chat, updates timestamp

### 10. Notifications
1. Go to "Notifications" (from profile dropdown)
2. View notification list
3. Mark as read
4. Delete notification

**Expected:** ✅ Notifications update status

### 11. Referrals
1. Go to "My Profile"
2. Click "Referrals" tab
3. Copy referral code
4. View referral stats

**Expected:** ✅ Referral code displayed, stats tracked

### 12. Reviews
1. Go back to "My Profile"
2. Find ReviewSection component
3. Leave a review for a doctor
4. Add star rating
5. Submit review

**Expected:** ✅ Review added, rating displayed

### 13. Admin Login
1. Go to http://localhost:5174
2. Enter admin credentials:
   - Email: MediSync123@gmail.com
   - Password: MediSync@123
3. See admin dashboard

**Expected:** ✅ Admin dashboard loads with metrics

### 14. Admin Functions
1. Click "Add Doctor"
2. Add doctor details and upload image
3. View doctors list
4. View appointments

**Expected:** ✅ Doctor added, appears in list

### 15. Doctor Login (Optional)
1. Use doctor email to login
2. View doctor dashboard
3. See appointments
4. Manage availability

**Expected:** ✅ Doctor dashboard functions

## 🐛 Common Issues & Fixes

### Backend Connection Error
**Error:** `connect ECONNREFUSED 127.0.0.1:4000`
- Check backend terminal is running
- Verify MongoDB connection in .env
- Check MONGODB_URI is correct

### MongoDB Connection Failed
**Error:** `MongoAuthError: authentication failed`
- Verify MONGODB_URI in backend/.env
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### Razorpay Error
**Error:** `RazorpayError: razorpay not initialized`
- Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
- Set RAZORPAY_DEMO_MODE=true for testing
- Verify keys are in correct .env file

### Cloudinary Upload Fails
**Error:** `Invalid Cloudinary credentials`
- Check CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY
- Verify credentials are correct
- Check image file format

### CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`
- Backend already has CORS enabled
- Check VITE_BACKEND_URL matches server port
- Clear browser cache and try again

### JWT Token Error
**Error:** `Invalid token`
- Clear localStorage and login again
- Check JWT_SECRET in backend/.env
- Verify token hasn't expired

## 📊 Testing Data

### Test User Credentials
```
Email: test@example.com
Password: Test@123
```

### Test Admin Credentials
```
Email: MediSync123@gmail.com
Password: MediSync@123
```

### Test Doctor Email Format
```
doctor@hospital.com
Password: Doctor@123
```

## 🔄 API Testing

### Using Postman/Thunder Client

**Register User:**
```
POST http://localhost:4000/api/user/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test@123"
}
```

**Book Appointment:**
```
POST http://localhost:4000/api/user/book-appointment
Headers: { token: "your-jwt-token" }
Body: {
  "docId": "doctor-id",
  "slotDate": "07_12_2024",
  "slotTime": "10:00 AM"
}
```

**Get User Profile:**
```
GET http://localhost:4000/api/user/get-profile
Headers: { token: "your-jwt-token" }
```

## 📱 Mobile Testing

1. Build frontend for production:
   ```bash
   npm run build
   ```

2. Test on mobile devices:
   - Get PC IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Open `http://YOUR_IP:5173` on mobile
   - Test all features

## 🎯 Performance Optimization

### Lighthouse Audit
1. Open DevTools (F12)
2. Click "Lighthouse" tab
3. Run audit
4. Check Performance, Accessibility, SEO scores

### Optimization Checklist
- [ ] Images are optimized
- [ ] CSS is minified
- [ ] JavaScript is minified
- [ ] Lazy loading enabled
- [ ] Caching headers set

## 🚢 Production Deployment

### Backend (Heroku/Railway)
```bash
# Prepare backend
cd backend
heroku login
heroku create medisync-api
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
# Prepare frontend
cd frontend
npm run build
# Deploy dist/ folder
```

### Admin (Vercel/Netlify)
```bash
# Prepare admin
cd admin
npm run build
# Deploy dist/ folder
```

## 🔒 Production Security

- [ ] Remove demo mode (`RAZORPAY_DEMO_MODE=false`)
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Restrict CORS to production URLs
- [ ] Hide sensitive environment variables
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting

## 📞 Support & Debugging

### Enable Debug Logging
Backend:
```javascript
// In server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})
```

Frontend:
```javascript
// In App.jsx or context
axios.interceptors.response.use(
  response => {
    console.log('API Response:', response)
    return response
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)
```

### Browser DevTools
- **Console:** Check for errors
- **Network:** Monitor API calls
- **Storage:** Check token and localStorage
- **Application:** View IndexedDB data

### Backend Logs
- Check console output in backend terminal
- Look for error stack traces
- Monitor MongoDB queries

## ✨ Next Steps

1. Test all features thoroughly
2. Fix any bugs found
3. Optimize performance
4. Add additional features if needed
5. Deploy to production
6. Monitor and maintain

## 📖 Documentation Files

- `SETUP_COMPLETE.md` - Complete feature documentation
- `IMPLEMENTATION_CHECKLIST.md` - What's been implemented
- `DEPLOYMENT_GUIDE.md` - This file

---

**Everything is ready to go! Start testing and let me know if you encounter any issues.** 🚀
