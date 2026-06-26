# 📊 Visual Flow Diagrams

## 🔔 NOTIFICATION FLOW - Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION FLOW                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ STEP 1: APPOINTMENT BOOKING                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Patient                                Doctor                  │
│     │                                       │                   │
│     ├─ Selects Date/Time ─────────────────►│                   │
│     │                                       │                   │
│     └◄────── Confirmation ────────────────┬─┘                   │
│             Received                       │                    │
│                                            │                    │
│     Database: Appointment Created          │                    │
│     ↓                                       ↓                    │
│  ┌──────────────────┐            ┌──────────────────┐           │
│  │ NOTIFICATION #1  │            │ NOTIFICATION #2  │           │
│  ├──────────────────┤            ├──────────────────┤           │
│  │ Title: Appt      │            │ Title: New       │           │
│  │ Confirmed        │            │ Booking          │           │
│  ├──────────────────┤            ├──────────────────┤           │
│  │ Type: appt       │            │ Type: appt       │           │
│  │ Status: Unread   │            │ Status: Unread   │           │
│  └──────────────────┘            └──────────────────┘           │
│     ↓                                   ↓                        │
│  Patient sees                      Doctor sees                  │
│  badge: 1 new                      badge: 1 new                │
│  notification                      notification                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ STEP 2: PATIENT PAYS ONLINE                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Patient                       Razorpay         Backend         │
│     │                              │               │            │
│     ├─ Clicks "Pay" ─────────────►│               │            │
│     │                              │               │            │
│     ├─ Enters Card Info ─────────►│               │            │
│     │                              │               │            │
│     ├─ Completes Payment ────────►│               │            │
│     │                              │               │            │
│     │                    Payment Confirmed        │            │
│     │                              ├──────────────►│            │
│     │                              │  Verify      │            │
│     │                              │  Payment     │            │
│     │                              │               │            │
│     │                         SUCCESS ◄────────────┤            │
│     │                              │               │            │
│  ┌──────────────────────────────────────────────┐  │            │
│  │ DATABASE UPDATES                             │  │            │
│  ├──────────────────────────────────────────────┤  │            │
│  │ 1. Appointment.payment = true                │  │            │
│  │ 2. INVOICE CREATED                           │  │            │
│  │    ├─ Status: Paid                           │  │            │
│  │    ├─ Amount: ₹500                           │  │            │
│  │    └─ Invoice#: INV-20250115-123456-789      │  │            │
│  │ 3. NOTIFICATION #3 (Patient)                 │  │            │
│  │    ├─ Title: "Payment Successful"            │  │            │
│  │    ├─ Message: "₹500 received"               │  │            │
│  │    └─ Type: "payment"                        │  │            │
│  │ 4. NOTIFICATION #4 (Doctor)                  │  │            │
│  │    ├─ Title: "Payment Received"              │  │            │
│  │    └─ From: Patient Name                     │  │            │
│  └──────────────────────────────────────────────┘  │            │
│     │                              │               │            │
│     ◄────── Success Alert ─────────◄───────────────┤            │
│                                                                  │
│  Patient:                    Doctor:                           │
│  ├─ See "Paid" badge        ├─ See payment received           │
│  ├─ Get notification        ├─ Get notification               │
│  ├─ Can download invoice    ├─ See invoice                    │
│  └─ Payment confirmed       └─ Appointment paid               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 💬 MESSAGE FLOW - Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                      MESSAGE FLOW                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ STEP 1: PATIENT INITIATES MESSAGE                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Patient                                                         │
│    │                                                            │
│    ├─ Goes to MyAppointment                                    │
│    │                                                            │
│    ├─ Finds appointment with Dr. Smith                         │
│    │                                                            │
│    ├─ Clicks [Message Doctor] button                           │
│    │                                                            │
│    ├─ Frontend checks:                                         │
│    │  "Does conversation exist?"                              │
│    │                                                            │
│    ├─ NO → Create new Conversation                            │
│    │        Participants: [Patient_ID, Doctor_ID]             │
│    │        Names: {Patient_ID: "John", Doctor_ID: "Smith"}   │
│    │                                                            │
│    └─ Messages page opens                                      │
│       With Dr. Smith selected (empty chat)                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ STEP 2: PATIENT SENDS MESSAGE                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Patient Types:                                                 │
│ "Hello Doctor, I have pain in my chest. What should I do?"    │
│                                                                  │
│                              ↓                                  │
│                         Clicks [Send]                           │
│                              ↓                                  │
│ API Call: POST /api/user/send-message                         │
│ Body: {                                                        │
│   conversationId: "conv123",                                  │
│   content: "Hello Doctor...",                                 │
│   recipientId: "doctor456"                                    │
│ }                                                              │
│                                                                  │
│                              ↓                                  │
│         messageController.sendMessage() executes               │
│                              ↓                                  │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ DATABASE: Message Saved                                 │   │
│ ├─────────────────────────────────────────────────────────┤   │
│ │ {                                                       │   │
│ │   conversationId: "conv123",                           │   │
│ │   senderId: "patient123",                             │   │
│ │   recipientId: "doctor456",                           │   │
│ │   content: "Hello Doctor, I have pain...",           │   │
│ │   isRead: false,                                      │   │
│ │   createdAt: 1705308000                              │   │
│ │ }                                                       │   │
│ └─────────────────────────────────────────────────────────┘   │
│                              ↓                                  │
│ Conversation Updated:                                        │
│ {                                                            │
│   _id: "conv123",                                           │
│   lastMessage: "Hello Doctor, I have pain...",             │
│   lastMessageTime: 1705308000,                             │
│   lastMessageSenderId: "patient123",                       │
│   updatedAt: 1705308000                                    │
│ }                                                            │
│                              ↓                                  │
│ NOTIFICATION CREATED (to doctor):                           │
│ {                                                            │
│   userId: "doctor456",                                      │
│   title: "New Message from John",                          │
│   message: "Hello Doctor, I have pain in my chest...",    │
│   type: "message",                                          │
│   relatedId: "message123",                                 │
│   isRead: false,                                           │
│   createdAt: 1705308000                                    │
│ }                                                            │
│                              ↓                                  │
│ Patient:                 Doctor:                            │
│ ├─ Message shows         ├─ Gets notification badge        │
│ ├─ "Sending..." → "Sent" ├─ Sees unread count: 1           │
│ └─ Green bubble right    └─ Clicks notification             │
│    (align)                                                   │
│                                                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ STEP 3: DOCTOR REPLIES                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Doctor (on Doctor Portal)                                       │
│    │                                                            │
│    ├─ Opens Messages page                                      │
│    │                                                            │
│    ├─ Sees conversation from John                              │
│    │  (lastMessage: "Hello Doctor, I have pain...")           │
│    │                                                            │
│    ├─ Clicks to open chat                                      │
│    │                                                            │
│    ├─ Sees message: "Hello Doctor, I have pain in chest?"     │
│    │                                                            │
│    ├─ Types reply:                                            │
│    │  "Please take rest and avoid heavy lifting..."            │
│    │                                                            │
│    └─ Clicks [Send]                                            │
│                                                                  │
│                    SAME PROCESS REPEATS:                        │
│                    ├─ Message saved to DB                      │
│                    ├─ Conversation updated                     │
│                    └─ Patient gets notification                │
│                                                                  │
│ Patient Sees:                                                  │
│ (Next time they check Messages)                               │
│                                                                  │
│ ┌────────────────────────────────────────────┐               │
│ │ Chat with Dr. Smith                        │               │
│ ├────────────────────────────────────────────┤               │
│ │                                            │               │
│ │     Hello Doctor, I have pain in chest   │               │
│ │     (blue bubble, left align)             │               │
│ │     Sent by: Patient                      │               │
│ │                                            │               │
│ │                                            │               │
│ │          Please take rest and avoid       │               │
│ │          heavy lifting...                  │               │
│ │     (grey bubble, right align)            │               │
│ │     Sent by: Dr. Smith                     │               │
│ │                                            │               │
│ └────────────────────────────────────────────┘               │
│                                                                  │
│ Multiple messages can go back and forth                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📄 INVOICE FLOW - Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                      INVOICE FLOW                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ STEP 1: APPOINTMENT BOOKING (NO INVOICE YET)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Patient Books Appointment with Dr. Smith (₹500)                │
│           ↓                                                     │
│  Appointment Created in Database                               │
│  {                                                              │
│    appointmentId: "appt123",                                   │
│    userId: "patient123",                                       │
│    docId: "doctor456",                                         │
│    amount: 500,                                                │
│    payment: false  ← Payment NOT received yet                 │
│  }                                                              │
│           ↓                                                     │
│  Patient sees appointment with status: "PENDING PAYMENT"       │
│           ↓                                                     │
│  NO INVOICE CREATED YET                                        │
│  (Invoice only created after payment verified)                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ STEP 2: PATIENT INITIATES PAYMENT                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Patient views "My Appointments"                               │
│           ↓                                                     │
│  Sees appointment with [Pay Online] button                     │
│           ↓                                                     │
│  Clicks [Pay Online]                                           │
│           ↓                                                     │
│  Frontend calls: /api/user/payment-razorpay                    │
│  {                                                              │
│    appointmentId: "appt123",                                   │
│    amount: 500,                                                │
│    currency: "INR"                                             │
│  }                                                              │
│           ↓                                                     │
│  Backend returns: razorpay payment order                       │
│           ↓                                                     │
│  Razorpay Payment Window Opens                                 │
│           ↓                                                     │
│  Patient enters card details                                   │
│           ↓                                                     │
│  Payment Completed!                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ STEP 3: PAYMENT VERIFICATION & INVOICE CREATION                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Backend receives Razorpay webhook:                            │
│  {                                                              │
│    razorpay_payment_id: "pay_123456",                         │
│    razorpay_order_id: "order_123456",                         │
│    razorpay_signature: "signature_123456"                     │
│  }                                                              │
│           ↓                                                     │
│  Signature Verification (Security check)                       │
│           ↓                                                     │
│  ✅ VERIFIED ✅                                               │
│           ↓                                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Multiple Database Updates Happen:                       │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │                                                         │  │
│  │ 1. APPOINTMENT UPDATED:                                │  │
│  │    appointment.payment = true                          │  │
│  │    appointment.paymentId = "pay_123456"               │  │
│  │                                                         │  │
│  │ 2. INVOICE CREATED:                                    │  │
│  │    {                                                   │  │
│  │      _id: "inv123",                                   │  │
│  │      appointmentId: "appt123",                        │  │
│  │      userId: "patient123",                           │  │
│  │      docId: "doctor456",                             │  │
│  │      amount: 500,                                     │  │
│  │      status: "paid",                                 │  │
│  │      paymentMethod: "online",                        │  │
│  │      invoiceNumber: "INV-20250115-123456-789",       │  │
│  │      issueDate: 1705308000,                          │  │
│  │      dueDate: 1712986800,  (30 days later)          │  │
│  │      items: [{                                        │  │
│  │        description: "Consultation",                   │  │
│  │        quantity: 1,                                   │  │
│  │        rate: 500                                      │  │
│  │      }]                                               │  │
│  │    }                                                   │  │
│  │                                                         │  │
│  │ 3. NOTIFICATION #1 - PATIENT:                        │  │
│  │    {                                                   │  │
│  │      userId: "patient123",                           │  │
│  │      title: "Payment Successful",                    │  │
│  │      message: "Your payment of ₹500 received",      │  │
│  │      type: "payment",                                │  │
│  │      relatedId: "inv123"                             │  │
│  │    }                                                   │  │
│  │                                                         │  │
│  │ 4. NOTIFICATION #2 - DOCTOR:                         │  │
│  │    {                                                   │  │
│  │      userId: "doctor456",                            │  │
│  │      title: "Payment Received",                      │  │
│  │      message: "Payment from Patient for appt...",   │  │
│  │      type: "payment",                                │  │
│  │      relatedId: "inv123"                             │  │
│  │    }                                                   │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│           ↓                                                     │
│  Success Response sent to Frontend                            │
│           ↓                                                     │
│  Patient sees:                                                 │
│  ├─ Payment badge: "✅ PAID"                                  │
│  ├─ Notification badge: 1 new                                 │
│  ├─ Message: "Payment Successful!"                            │
│  └─ Can now download invoice                                  │
│                                                                  │
│  Doctor sees:                                                  │
│  ├─ Appointment status: "PAYMENT RECEIVED"                    │
│  ├─ Notification badge: 1 new                                 │
│  └─ Payment confirmed from patient                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ STEP 4: PATIENT VIEWS & DOWNLOADS INVOICE                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Patient clicks profile dropdown → Invoices                    │
│           ↓                                                     │
│  Invoices page loads                                           │
│  API Call: GET /api/user/get-invoices                         │
│           ↓                                                     │
│  Shows Statistics:                                             │
│  ┌────────────────┬───────────────┬─────────────────┐        │
│  │ Total Invoices │ Total Amount  │ Outstanding     │        │
│  │      1         │     ₹500      │     ₹0          │        │
│  └────────────────┴───────────────┴─────────────────┘        │
│           ↓                                                     │
│  Shows Invoice List:                                           │
│  ┌───────────────────────────────────────────────────┐        │
│  │ Invoice #INV-20250115-123456-789                 │        │
│  │ [PAID]                                            │        │
│  │ Doctor: Dr. Smith                                │        │
│  │ Date: Jan 15, 2025                               │        │
│  │ Amount: ₹500                                      │        │
│  │ [View] [Download]                                │        │
│  └───────────────────────────────────────────────────┘        │
│           ↓                                                     │
│  Patient clicks [View] →                                       │
│  Modal Shows Full Invoice Details:                            │
│  ┌───────────────────────────────────────────────────┐        │
│  │ Invoice #INV-20250115-123456-789                 │        │
│  │                                                   │        │
│  │ Invoice Date: Jan 15, 2025                       │        │
│  │ Status: PAID ✅                                  │        │
│  │ Amount: ₹500                                      │        │
│  │ Payment Method: Razorpay                         │        │
│  │                                                   │        │
│  │ SERVICES PROVIDED:                                │        │
│  │ Consultation Fee          ₹500                   │        │
│  │                                                   │        │
│  │ DOCTOR DETAILS:                                  │        │
│  │ Dr. Smith                                        │        │
│  │ Cardiologist                                     │        │
│  │                                                   │        │
│  │ [Close] [Download PDF]                           │        │
│  └───────────────────────────────────────────────────┘        │
│           ↓                                                     │
│  Patient clicks [Download PDF]                                │
│           ↓                                                     │
│  API Call: POST /api/user/download-invoice                    │
│           ↓                                                     │
│  Backend returns invoice data                                  │
│           ↓                                                     │
│  Frontend creates downloadable file                           │
│  (Currently: Text file, Can upgrade to PDF)                   │
│           ↓                                                     │
│  File downloaded: invoice-inv123.txt                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 COMPLETE FLOW - All Three Together

```
TIME: 9:00 AM → Patient Books Appointment
├─ Notification #1 (Patient) ✓
├─ Notification #2 (Doctor) ✓
└─ Status: Appointment Created, Waiting for Payment

TIME: 2:00 PM → Patient Messages Doctor
├─ Message Created ✓
├─ Conversation Created ✓
├─ Notification #3 (Doctor) ✓
└─ Status: Conversation Active

TIME: 3:00 PM → Doctor Replies
├─ Reply Message Created ✓
├─ Notification #4 (Patient) ✓
├─ Conversation Updated ✓
└─ Status: Conversation Ongoing

TIME: 4:00 PM → Patient Pays
├─ Payment Verified ✓
├─ Invoice #1 Created ✓
├─ Notification #5 (Patient) ✓
├─ Notification #6 (Doctor) ✓
└─ Status: Payment Confirmed

TIME: 5:00 PM → Patient Checks Invoices
├─ Sees 1 invoice (Paid)
├─ Views details
├─ Downloads as text file
└─ Status: Invoice Retrieved

TIME: 6:00 PM → Doctor Views Dashboard
├─ Sees payment received
├─ Sees new message from patient
├─ Views patient appointment with payment confirmed
└─ Status: All information accessible
```

