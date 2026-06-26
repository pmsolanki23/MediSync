# MediSync - Notifications, Messages, Invoices Complete Flow

## 📋 **TABLE OF CONTENTS**
1. Notifications Flow
2. Messages Flow
3. Invoices Flow
4. How They Connect

---

## 🔔 **PART 1: NOTIFICATIONS FLOW**

### **What Are Notifications?**
Notifications are alerts sent to users about their appointments, payments, messages, etc.

### **When Do Notifications Get Created?**

#### **1️⃣ When Appointment is Booked**
```
USER → Books Appointment → Notification Created
│
├─ Title: "Appointment Confirmed"
├─ Message: "Your appointment with Dr. [Name] on [Date] at [Time] is confirmed"
├─ Type: "appointment"
├─ Related ID: appointment ID
└─ Sent to: Patient (User)

SAME TIME → Doctor Also Gets Notification
├─ Title: "New Appointment Booking"
├─ Message: "[Patient Name] booked appointment on [Date] at [Time]"
├─ Type: "appointment"
└─ Sent to: Doctor
```

#### **2️⃣ When Appointment is Cancelled**
```
USER → Cancels Appointment → Notification Created
│
├─ Title: "Appointment Cancelled"
├─ Message: "Your appointment with Dr. [Name] has been cancelled"
├─ Type: "appointment"
└─ Sent to: Both Patient & Doctor
```

#### **3️⃣ When Payment is Received**
```
USER → Pays for Appointment → Payment Verified → Notification
│
├─ Title: "Payment Successful"
├─ Message: "Payment of ₹[Amount] received for appointment on [Date]"
├─ Type: "payment"
├─ Related ID: invoice ID
└─ Sent to: Patient

SAME TIME → Doctor Gets Notification
├─ Title: "Payment Received"
├─ Message: "Payment received for [Patient] appointment"
└─ Sent to: Doctor
```

#### **4️⃣ When Doctor Adds Prescription**
```
DOCTOR → Adds Prescription for Patient → Notification
│
├─ Title: "New Prescription"
├─ Message: "Dr. [Name] has added a prescription for you"
├─ Type: "prescription"
└─ Sent to: Patient
```

#### **5️⃣ When New Message Arrives**
```
DOCTOR → Sends Message to Patient → Notification
│
├─ Title: "New Message from Dr. [Name]"
├─ Message: "[First 50 characters of message]"
├─ Type: "message"
└─ Sent to: Patient
```

### **How to Access Notifications?**

**User Path:**
```
Login → Profile Dropdown → Click "🔔 Notifications"
         ↓
    See All Notifications
         ↓
    Mark as Read / Delete
```

### **Notification Model (Backend)**
```javascript
{
  _id: ObjectId,
  userId: "user123",           // Who gets this notification
  title: "Appointment Confirmed",
  message: "Your appointment is on Jan 15, 2025",
  type: "appointment",         // appointment, payment, prescription, message, system
  relatedId: "appointment456", // Link to related data
  isRead: false,              // Whether user has seen it
  createdAt: 1234567890      // Timestamp when created
}
```

### **API Endpoints for Notifications**

| Endpoint | Method | What It Does | Request Body |
|----------|--------|-------------|--------------|
| `/api/user/get-notifications` | POST | Get all notifications | `{ userId }` |
| `/api/user/mark-notification-read` | POST | Mark one as read | `{ notificationId }` |
| `/api/user/mark-all-read` | POST | Mark all as read | `{ userId }` |
| `/api/user/delete-notification` | POST | Delete a notification | `{ notificationId }` |
| `/api/user/unread-count` | POST | Get unread count | `{ userId }` |

### **Frontend Display**

```
🔔 NOTIFICATIONS PAGE

[Header] Mark All Read Button

[Filter] All | Unread

[Notification Cards]
┌─────────────────────────────────────┐
│ 📅 Appointment Confirmed            │ ← Icon based on type
│ Your appointment is on Jan 15       │ ← Title
│ "Your appointment with Dr. Smith... │ ← Message
│ 2 hours ago                         │ ← Time
│ [Mark Read] [Delete]                │ ← Actions
└─────────────────────────────────────┘

[Unread Notification - Different Color]
```

---

## 💬 **PART 2: MESSAGES FLOW**

### **What Are Messages?**
Messages are conversations between patients and doctors for health consultations.

### **How Messages Work - Step by Step**

#### **Step 1: Patient Books Appointment**
```
Patient → Books Appointment with Dr. Smith
```

#### **Step 2: After Appointment (or Anytime), Patient Can Message Doctor**
```
Patient → Goes to Messages page
         ↓
       [Conversations List - Empty initially]
         ↓
    Patient needs way to start conversation
    (This part needs to be added to MyAppointment page)
         ↓
    Patient clicks "Message Doctor" on appointment
         ↓
    New Conversation Created Automatically
```

#### **Step 3: Send First Message**
```
Patient Types Message: "Hello Doctor, I have a question about..."
                        ↓
                   Clicks "Send"
                        ↓
           Message Saved in Database
                        ↓
        Conversation Updated (lastMessage, lastMessageTime)
                        ↓
          Doctor Receives Notification (Optional)
                        ↓
        Message appears on Doctor's Messages page
```

#### **Step 4: Doctor Replies**
```
Doctor → Goes to Messages
        ↓
    Sees Conversation from Patient
        ↓
    Opens Conversation
        ↓
    Types Reply Message
        ↓
    Clicks "Send"
        ↓
    Message Saved
        ↓
    Patient Gets Notification
        ↓
    Patient Sees New Message
```

### **Message Model (Backend)**
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,    // Which conversation this belongs to
  senderId: "user123",         // Who sent it
  recipientId: "doctor456",    // Who it's for
  content: "Hello Doctor...",  // Actual message text
  isRead: false,              // Whether recipient read it
  createdAt: 1234567890       // When sent
}
```

### **Conversation Model (Backend)**
```javascript
{
  _id: ObjectId,
  participants: ["user123", "doctor456"],  // Both people in conversation
  participantNames: {
    "user123": "John Doe",
    "doctor456": "Dr. Smith"
  },
  participantImages: {
    "user123": "image_url",
    "doctor456": "image_url"
  },
  lastMessage: "Hello, how are you?",
  lastMessageTime: 1234567890,
  lastMessageSenderId: "doctor456",
  createdAt: 1234567890,
  updatedAt: 1234567890
}
```

### **API Endpoints for Messages**

| Endpoint | Method | What It Does | Request Body |
|----------|--------|-------------|--------------|
| `/api/user/send-message` | POST | Send a message | `{ recipientId, content, conversationId? }` |
| `/api/user/get-messages` | POST | Get messages in conversation | `{ conversationId, page?, limit? }` |
| `/api/user/get-conversations` | POST | Get all conversations | `{}` |
| `/api/user/delete-conversation` | POST | Delete entire conversation | `{ conversationId }` |

### **Frontend Display**

```
💬 MESSAGES PAGE

[Left Side - Conversations List]
┌──────────────────────────┐
│ CONVERSATIONS            │
├──────────────────────────┤
│ Dr. Smith                │ ← Click to open
│ "How are you doing?"     │    conversation
│ Jan 15, 2025             │
└──────────────────────────┘
│ Dr. Johnson              │
│ "See you tomorrow"       │
│ Jan 14, 2025             │
└──────────────────────────┘

[Right Side - Chat Area]
┌──────────────────────────────┐
│ Dr. Smith        [Delete]    │
├──────────────────────────────┤
│                              │
│         Hello Doctor!        │ ← Patient message
│         (aligned right)      │
│                              │
│    I can help you with that  │
│    (aligned left)            │ ← Doctor message
│                              │
├──────────────────────────────┤
│ [Type message...] [Send]     │ ← Input field
└──────────────────────────────┘
```

### **How Conversation is Created?**

#### **Option 1: Automatic (When First Message Sent)**
```
Patient sends message to doctor
    ↓
Check if conversation exists between them
    ↓
If NO: Create new conversation with both participants
    ↓
Save message to this conversation
```

#### **Option 2: Manual (From Appointment Page) - TO BE IMPLEMENTED**
```
Patient views appointment
    ↓
Clicks "Message Doctor" button
    ↓
Conversation created if doesn't exist
    ↓
Chat page opens (empty)
    ↓
Patient can type first message
```

---

## 📄 **PART 3: INVOICES FLOW**

### **What Is an Invoice?**
An invoice is a bill/receipt for an appointment payment.

### **When Are Invoices Created?**

#### **1️⃣ When Appointment Payment is Verified**
```
Patient Books Appointment (₹500)
         ↓
Payment Pending (No Invoice Yet)
         ↓
Patient Clicks "Pay Online"
         ↓
Razorpay Payment Gateway Opens
         ↓
Patient Completes Payment
         ↓
Backend Verifies Payment
         ↓
✅ INVOICE CREATED AUTOMATICALLY
│
├─ Invoice Number: INV-20250115-123456-789
├─ Amount: ₹500
├─ Status: Paid
├─ Doctor: Dr. Smith
├─ Date: Jan 15, 2025
├─ Payment Method: Razorpay (Online)
└─ Can be downloaded as receipt

PLUS → Notification sent to patient
      "Payment Successful! Invoice ready."
```

#### **2️⃣ When Appointment is Completed (Doctor Marks as Done)**
```
Doctor → Views Appointment
        ↓
    Marks as "Completed"
        ↓
Invoice Status might change or new invoice created
        ↓
Patient notified: "Appointment Complete - Invoice Available"
```

### **Invoice Model (Backend)**
```javascript
{
  _id: ObjectId,
  appointmentId: ObjectId,     // Which appointment this is for
  userId: "patient123",        // Who paid
  docId: "doctor456",          // Which doctor
  amount: 500,                 // How much was paid
  paymentMethod: "online",     // cash, online, wallet
  status: "paid",              // pending, paid, refunded
  invoiceNumber: "INV-...",    // Unique invoice number
  issueDate: 1234567890,       // When created
  dueDate: 1234567890,         // When payment is due (if pending)
  items: [
    {
      description: "Consultation",
      quantity: 1,
      rate: 500
    }
  ],
  notes: "Thank you for appointment"
}
```

### **API Endpoints for Invoices**

| Endpoint | Method | What It Does | Request Body |
|----------|--------|-------------|--------------|
| `/api/user/get-invoices` | POST | Get all invoices | `{ userId, status?, page?, limit? }` |
| `/api/user/get-invoice` | POST | Get single invoice | `{ userId, invoiceId }` |
| `/api/user/invoice-stats` | POST | Get invoice statistics | `{ userId }` |
| `/api/user/download-invoice` | POST | Download invoice | `{ userId, invoiceId }` |

### **Frontend Display**

```
📄 INVOICES PAGE

[Stats Section]
┌───────────┬───────────┬─────────────┐
│ Total     │ Total     │ Outstanding │
│ Invoices  │ Amount    │ Amount      │
├───────────┼───────────┼─────────────┤
│    5      │  ₹5,000   │   ₹1,000    │
└───────────┴───────────┴─────────────┘

[Invoice List]
┌─────────────────────────────────────┐
│ Invoice #INV-20250115-123456-789    │
│ [PAID]                              │ ← Status Badge
│ Doctor: Dr. Smith                   │
│ Date: Jan 15, 2025                  │
│ Amount: ₹500                        │
│ Payment: Online (Razorpay)          │
│ [View] [Download]                   │
└─────────────────────────────────────┘

[Invoice Detail Modal When Clicked]
┌─────────────────────────────────────┐
│ Invoice #INV-20250115-123456-789    │
│                                     │
│ Invoice Date: Jan 15, 2025          │
│ Status: PAID                        │
│ Amount: ₹500                        │
│                                     │
│ SERVICES PROVIDED                   │
│ ├─ Consultation Fee      ₹500       │
│                                     │
│ DOCTOR DETAILS                      │
│ ├─ Dr. Smith                        │
│ ├─ Speciality: Cardiologist         │
│                                     │
│ [Close] [Download PDF]              │
└─────────────────────────────────────┘
```

### **Invoice Status**
- **Pending**: Payment not received yet, payment due date not passed
- **Paid**: Payment received successfully
- **Refunded**: Payment was refunded to patient

---

## 🔗 **PART 4: HOW THEY ALL CONNECT**

### **Complete User Journey**

```
USER JOURNEY - Start to Finish

1. PATIENT BOOKS APPOINTMENT
   └─ userController.bookAppointment()
      ├─ ✅ Appointment Created
      ├─ ✅ Notification #1 Created (Appointment Confirmed)
      │  (To Patient: "Appointment booked with Dr. Smith on Jan 15")
      │
      └─ ✅ Notification #2 Created (New Booking for Doctor)
         (To Doctor: "Patient booked appointment on Jan 15")

2. PATIENT WANTS TO ASK QUESTIONS
   └─ Patient goes to MyAppointment page
      ├─ Clicks "Message Doctor" button
      └─ messageController.sendMessage()
         ├─ ✅ Conversation Created (if new)
         ├─ ✅ First Message Saved
         ├─ ✅ Notification #3 Created (New Message)
         │  (To Doctor: "Patient: Hello doctor...")
         └─ Message appears on Doctor's Messages page

3. DOCTOR REPLIES
   └─ doctorController message handler (not shown, similar flow)
      ├─ ✅ Reply Message Saved
      ├─ ✅ Notification #4 Created
      │  (To Patient: "Dr. Smith: Thanks for asking...")
      └─ Patient sees notification and new message

4. APPOINTMENT DAY - PATIENT PAYS
   └─ Patient goes to MyAppointment
      ├─ Clicks "Pay Online"
      ├─ Razorpay payment window opens
      ├─ Patient completes payment
      └─ Backend receives payment confirmation
         ├─ userController.verifyRazorpay()
         │  ├─ ✅ Invoice Created
         │  │  (Status: Paid, Amount: ₹500)
         │  │
         │  ├─ ✅ Notification #5 Created
         │  │  (To Patient: "Payment Successful!")
         │  │
         │  └─ ✅ Notification #6 Created
         │     (To Doctor: "Payment received from patient")
         │
         └─ Appointment marked as payment: true

5. PATIENT VIEWS INVOICES
   └─ Patient goes to Invoices page (from profile dropdown)
      ├─ Frontend calls: GET /api/user/get-invoices
      ├─ Backend returns all paid invoices
      └─ Patient sees:
         ├─ Total invoices: 1
         ├─ Total amount: ₹500
         ├─ Outstanding: ₹0
         └─ List with "Download" button

6. PATIENT DOWNLOADS INVOICE
   └─ Patient clicks "Download" on invoice
      ├─ Frontend calls: POST /api/user/download-invoice
      └─ Backend returns invoice data
         └─ Frontend creates downloadable text file
            (PDF generation requires library - can add later)

7. DOCTOR VIEWS PATIENT HISTORY
   └─ Doctor can see:
      ├─ All messages with patient
      ├─ Appointment details
      └─ Payment status via invoice
```

---

## ⚙️ **TECHNICAL FLOW - Code Level**

### **Creating a Notification (Backend Code)**
```javascript
// In any controller, when something happens:
const notification = await notificationModel.create({
  userId: patientId,
  title: "Appointment Confirmed",
  message: "Your appointment with Dr. Smith on Jan 15 at 2:00 PM",
  type: "appointment",
  relatedId: appointmentId,
  isRead: false,
  createdAt: Date.now()
});
// Notification now appears in patient's notification list
```

### **Sending a Message (Backend Code)**
```javascript
// Patient sends message
const message = await messageModel.create({
  conversationId: convId,
  senderId: patientId,
  recipientId: doctorId,
  content: "Hello doctor, how are you?",
  createdAt: Date.now()
});

// Update conversation with latest message
await conversationModel.findByIdAndUpdate(convId, {
  lastMessage: "Hello doctor, how are you?",
  lastMessageTime: Date.now(),
  lastMessageSenderId: patientId
});

// Optionally create notification for doctor
await notificationModel.create({
  userId: doctorId,
  title: "New Message from " + patientName,
  message: "Hello doctor, how are you?",
  type: "message",
  relatedId: messageId,
  isRead: false,
  createdAt: Date.now()
});
```

### **Creating Invoice (Backend Code)**
```javascript
// After payment verification
const invoice = await invoiceModel.create({
  appointmentId: appointmentId,
  userId: patientId,
  docId: doctorId,
  amount: 500,
  paymentMethod: "online",
  status: "paid",
  invoiceNumber: generateInvoiceNumber(),
  issueDate: Date.now(),
  dueDate: Date.now() + 30*24*60*60*1000
});

// Create notification
await notificationModel.create({
  userId: patientId,
  title: "Payment Successful",
  message: "Your payment of ₹500 has been received",
  type: "payment",
  relatedId: invoiceId,
  isRead: false,
  createdAt: Date.now()
});
```

---

## 📱 **USER INTERFACE FLOW**

### **Patient's Daily Interaction**

```
Patient Logs In
    ↓
Profile Dropdown appears
    ↓
Options:
├─ My Profile ─────────────────┐
├─ My Appointments ────────┐   │
├─ 💬 Messages (with count) │   │
├─ 🔔 Notifications        │   │
│  (with red badge)         │   │
├─ 📄 Invoices              │   │
└─ Logout                   │   │
                            │   │
Click "Notifications" ◄─────┘   │
    ↓                           │
See all notifications           │
├─ Filter: All | Unread        │
├─ List notifications          │
│  ├─ 📅 Appointment Confirmed │
│  ├─ 💳 Payment Successful    │
│  ├─ 💬 Dr. Smith sent message│
│  └─ 📋 Prescription Ready    │
└─ Mark as read / Delete       │
                                │
Click "Messages" ◄──────────────┤
    ↓                           │
See conversations               │
├─ Dr. Smith                   │
│  "How are you?"              │
│  [Open Chat]                 │
└─ Dr. Johnson                 │
   "See you tomorrow"          │
   [Open Chat]                 │
                                │
Click "Invoices" ◄──────────────┘
    ↓
See statistics
├─ Total: 5 invoices
├─ Amount: ₹5,000
└─ Outstanding: ₹1,000

List invoices
├─ Invoice #123 - PAID - ₹500
├─ Invoice #124 - PAID - ₹600
└─ [View] [Download]
```

---

## 🔧 **WHAT NEEDS TO BE IMPLEMENTED STILL**

### **1. Auto-Notification Creation**
Currently, notifications exist but nothing creates them. Need to add code to:
- `bookAppointment()` - Create notification when appointment booked
- `cancelAppointment()` - Create notification when cancelled
- `verifyRazorpay()` - Create notification when payment received
- `addPrescription()` - Create notification when prescription added (not shown)

### **2. Message Doctor Button**
Need to add on MyAppointment page:
```
For each appointment, add button:
[Message Doctor] 
    ↓
Opens Messages page with that doctor selected
```

### **3. PDF Generation (Optional)**
For invoices, can add library like `pdfkit` to generate actual PDF files instead of just text.

### **4. Real-time Updates (Optional)**
Currently, notifications/messages require page refresh. Can add:
- Socket.io for real-time updates
- Or periodic polling (refresh every 5 seconds)

---

## 📊 **Summary Table**

| Feature | Triggered By | Creates What | Sent To | API Endpoint |
|---------|-------------|-------------|---------|-------------|
| **Notification** | Various events | Database record | User | `/get-notifications` |
| **Message** | User sends text | Database record | Recipient | `/send-message` |
| **Invoice** | Payment verified | Database record | User | `/get-invoices` |
| **Conversation** | First message sent | Database record | Both users | `/get-conversations` |

---

## 🎯 **QUICK REFERENCE - What Happens When?**

```
👤 PATIENT ACTIONS → 📊 SYSTEM RESPONSE

Book Appointment → Notification (Patient + Doctor)
Cancel Appointment → Notification (Patient + Doctor)
Message Doctor → Message + Notification (to doctor)
Pay Online → Invoice + Notification (Patient + Doctor)
View Notifications → Marks as read
Download Invoice → Creates file to download
View Messages → Shows all conversations
```

