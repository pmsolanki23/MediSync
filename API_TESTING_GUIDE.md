# MediSync API Testing Guide

## Feature Testing Scenarios

### 1. INVOICES Feature

#### Endpoints:
- `POST /api/user/get-invoices` - Get user invoices
- `POST /api/user/get-invoice` - Get single invoice
- `POST /api/user/invoice-stats` - Get invoice statistics
- `POST /api/user/download-invoice` - Download invoice

#### Test Flow:
1. User books appointment and pays → Invoice auto-created ✓
2. GET `/api/user/get-invoices` with pagination → Returns invoice list with enriched data
3. GET `/api/user/get-invoice` → Returns invoice with doctor details
4. GET `/api/user/download-invoice` → Returns invoice data formatted for PDF

#### Expected Behavior:
- Invoice created when Razorpay payment verified
- Invoice status = "paid" after successful payment
- Invoice contains: invoiceNumber, amount, date, doctorName, doctorSpeciality
- PDF download shows all appointment details

#### Sample Request:
```bash
POST /api/user/get-invoices
Headers: Authorization: Bearer {token}
Body: {
  "userId": "user_id",
  "status": "all",
  "page": 1,
  "limit": 10
}
```

---

### 2. MESSAGES Feature

#### Endpoints:
- `POST /api/user/send-message` - Send message
- `POST /api/user/get-messages` - Get conversation messages
- `POST /api/user/get-conversations` - Get all conversations
- `POST /api/user/delete-conversation` - Delete conversation

#### Test Flow:
1. User sends message to doctor → Conversation created
2. GET conversations → Lists all user conversations
3. GET messages from conversation → Shows chat history
4. Delete conversation → Removes all messages

#### Expected Behavior:
- Message sent with fields: recipientId, content, conversationId
- Conversation auto-created if not exists
- Messages sorted chronologically
- User can see all conversations sorted by latest message time

#### Sample Request:
```bash
POST /api/user/send-message
Headers: Authorization: Bearer {token}
Body: {
  "recipientId": "doctor_id",
  "content": "Hello doctor",
  "conversationId": null
}
Response: {
  "success": true,
  "message": {
    "_id": "...",
    "conversationId": "...",
    "senderId": "user_id",
    "recipientId": "doctor_id",
    "content": "Hello doctor",
    "createdAt": timestamp
  }
}
```

---

### 3. NOTIFICATIONS Feature

#### Endpoints:
- `POST /api/user/get-notifications` - Get notifications
- `POST /api/user/mark-notification-read` - Mark as read
- `POST /api/user/mark-all-read` - Mark all as read
- `POST /api/user/delete-notification` - Delete notification
- `POST /api/user/unread-count` - Get unread count

#### Test Flow:
1. User books appointment → Notification created
2. GET notifications → Shows all notifications
3. GET unread-count → Shows badge number
4. Mark as read → Changes isRead to true
5. Delete notification → Removes notification

#### Expected Behavior:
- Notifications auto-created for: appointment booking, completion, cancellation, prescriptions
- Field names: isRead (not read)
- Notification types: appointment, prescription, payment, message, system
- Unread count accurate

#### Sample Request:
```bash
POST /api/user/get-notifications
Headers: Authorization: Bearer {token}
Body: {
  "userId": "user_id"
}
Response: {
  "success": true,
  "notifications": [
    {
      "_id": "...",
      "userId": "user_id",
      "title": "Appointment Booked Successfully",
      "message": "Your appointment with Dr. John has been booked",
      "type": "appointment",
      "isRead": false,
      "createdAt": timestamp
    }
  ]
}
```

---

### 4. PRESCRIPTIONS Feature

#### Endpoints:
- `POST /api/doctor/create-prescription` - Add prescription (Doctor)
- `POST /api/user/get-prescriptions` - Get user prescriptions
- `POST /api/user/get-prescription` - Get single prescription

#### Test Flow:
1. Doctor completes appointment → Can view in dashboard
2. Doctor adds prescription with medications
3. User GET prescriptions → Shows all prescriptions
4. User downloads prescription → Shows formatted PDF

#### Expected Behavior:
- Doctor can add prescription only after appointment completed
- Prescription contains: medications, diagnosis, notes, date, expiryDate
- User sees enriched prescription with doctorName, doctorSpeciality
- Prescription valid for 90 days

#### Sample Request:
```bash
POST /api/doctor/create-prescription
Headers: Authorization: Bearer {token}
Body: {
  "appointmentId": "appt_id",
  "medications": [
    {
      "name": "Aspirin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "5 days",
      "notes": "Take with food"
    }
  ],
  "diagnosis": "Mild fever",
  "notes": "Rest well"
}
Response: {
  "success": true,
  "prescription": {
    "_id": "...",
    "appointmentId": "appt_id",
    "userId": "...",
    "docId": "...",
    "medications": [...],
    "diagnosis": "Mild fever",
    "date": timestamp,
    "expiryDate": timestamp + 90 days
  }
}
```

---

## Integration Testing Flow

### Complete User Journey:
1. ✓ User books appointment with doctor
   - Notification created: "Appointment Booked Successfully"
2. ✓ User completes payment via Razorpay
   - Invoice auto-created with status="paid"
3. ✓ Doctor completes appointment
   - Notification created: "Appointment Completed"
4. ✓ Doctor adds prescription
   - Notification created: "New Prescription from Doctor"
5. ✓ User views prescription
   - Shows medications, diagnosis, doctor details
6. ✓ User views invoice
   - Shows appointment details, amount, payment status
7. ✓ User and doctor message
   - Conversation created
   - Messages sent/received
8. ✓ User views notifications
   - All events appear in notification center
   - Can mark read/delete

---

## Testing Checklist

### INVOICES:
- [ ] Invoice created after payment verification
- [ ] Invoice list retrieval with pagination
- [ ] Invoice stats calculation
- [ ] PDF download generation
- [ ] Status filtering works

### MESSAGES:
- [ ] Message sent successfully
- [ ] Conversation created automatically
- [ ] Message retrieval with pagination
- [ ] Conversations list retrieval
- [ ] Message field names correct (content, not message)

### NOTIFICATIONS:
- [ ] Notification created on appointment booking
- [ ] Notification created on prescription added
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Unread count accurate
- [ ] Delete notification works

### PRESCRIPTIONS:
- [ ] Prescription created by doctor
- [ ] User retrieves prescriptions
- [ ] Prescription enriched with doctor details
- [ ] Expiry date calculated (90 days)
- [ ] PDF download works

---

## Frontend Context Setup

Ensure AppContext provides:
```javascript
{
  backendUrl: import.meta.env.VITE_BACKEND_URL,
  token: localStorage.getItem('token'),
  userData: { _id, name, email, ... },
  currencySymbol: 'Rs.'
}
```

Header must include:
```javascript
{
  Authorization: `Bearer ${token}`
  // OR
  token: token
}
```

---

## Common Issues & Fixes

### Issue: Message not sent
- Fix: Ensure recipientId is passed, not conversationId in body

### Issue: Notifications not showing
- Fix: Check field name is `isRead` not `read`

### Issue: Invoice not created
- Fix: Verify payment was marked as paid and appointmentId exists

### Issue: Prescription can't be added
- Fix: Ensure appointment payment is verified and appointmentId is correct

