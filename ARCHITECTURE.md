# MediSync Platform Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          MediSync Platform                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Frontend)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────┐ │
│  │   Patient Portal     │  │   Admin Dashboard    │  │ Doctor Portal │ │
│  │   (Port 5173)        │  │   (Port 5174)        │  │ (via Admin)   │ │
│  │                      │  │                      │  │               │ │
│  │ - Home               │  │ - Dashboard          │  │ - Dashboard   │ │
│  │ - Doctors            │  │ - Add Doctor         │  │ - Appt View   │ │
│  │ - Appointments       │  │ - Doctor List        │  │ - Profile     │ │
│  │ - Invoices           │  │ - Appointments       │  │ - Availability│ │
│  │ - Messages           │  │ - Analytics          │  │               │ │
│  │ - Notifications      │  │                      │  │               │ │
│  │ - Prescriptions      │  │                      │  │               │ │
│  │ - Wallet             │  │                      │  │               │ │
│  │ - Reviews            │  │                      │  │               │ │
│  │ - Referrals          │  │                      │  │               │ │
│  └──────────────────────┘  └──────────────────────┘  └───────────────┘ │
│                                                                           │
│  Technology: React + Vite + Tailwind CSS + Axios                        │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▼
                          (HTTPS REST API calls)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER (Backend)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Server: Express.js (Port 4000)                                         │
│  Middleware: CORS, JWT Auth, Input Validation                           │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    Route Layer (40+ endpoints)                     │ │
│  │                                                                    │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│ │
│  │  │  User Routes     │  │ Doctor Routes    │  │ Admin Routes     ││ │
│  │  │                  │  │                  │  │                  ││ │
│  │  │ - Register       │  │ - Login          │  │ - Add Doctor     ││ │
│  │  │ - Login          │  │ - Profile        │  │ - List Doctors   ││ │
│  │  │ - Profile        │  │ - Appointments   │  │ - View Appts     ││ │
│  │  │ - Appointments   │  │ - Availability   │  │ - Stats          ││ │
│  │  │ - Reschedule     │  │ - Update Profile │  │                  ││ │
│  │  │ - Invoices       │  │                  │  │                  ││ │
│  │  │ - Prescriptions  │  │                  │  │                  ││ │
│  │  │ - Reviews        │  │                  │  │                  ││ │
│  │  │ - Wallet         │  │                  │  │                  ││ │
│  │  │ - Messages       │  │                  │  │                  ││ │
│  │  │ - Notifications  │  │                  │  │                  ││ │
│  │  │ - Referrals      │  │                  │  │                  ││ │
│  │  │ - OTP            │  │                  │  │                  ││ │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘│ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                   Controller Layer (14 files)                      │ │
│  │                                                                    │ │
│  │  Business Logic, Validation, Response Handling                    │ │
│  │                                                                    │ │
│  │  - userController           - invoiceController                   │ │
│  │  - doctorController          - reviewController                   │ │
│  │  - appointmentExtended       - walletController                   │ │
│  │  - messageController         - prescriptionController             │ │
│  │  - notificationController    - otpController                      │ │
│  │  - referralController        - adminController                    │ │
│  │  - appointmentReschedule     - availabilityController             │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    ▼                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER (Models)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Mongoose ODM with 15 Schema Models:                                    │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Core Models         │  Transaction Models  │  Communication Models│ │
│  │  ────────────────    │  ──────────────────  │  ──────────────────│ │
│  │  - userModel         │  - invoiceModel      │  - messageModel     │ │
│  │  - doctorModel       │  - walletModel       │  - conversationModel│ │
│  │  - appointmentModel  │  - referralModel     │  - notificationModel│ │
│  │  - prescriptionModel │  - transactionModel  │  - otpModel         │ │
│  │  - reviewModel       │  - appointmentNote   │                     │ │
│  │  - availability      │  - recurring         │                     │ │
│  │                      │  - appointment       │                     │ │
│  │                      │                      │                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  Technology: Mongoose + MongoDB                                         │
│  Features: Validation, Indexes, Relationships                           │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER (MongoDB)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  MongoDB Atlas Cloud Database                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Collections:                                                      │ │
│  │  - users (with email unique index)                                │ │
│  │  - doctors (with speciality index)                                │ │
│  │  - appointments (with status & date index)                        │ │
│  │  - invoices (with appointmentId unique index)                     │ │
│  │  - reviews (with doctorId & userId index)                         │ │
│  │  - wallets (with userId unique index)                             │ │
│  │  - messages (with chatId timestamp index)                         │ │
│  │  - conversations (with userId-docId unique index)                 │ │
│  │  - notifications (with userId index)                              │ │
│  │  - otps (with email temporary index)                              │ │
│  │  - prescriptions (with userId & doctorId index)                   │ │
│  │  - referrals (with code unique index)                             │ │
│  │  - doctorAvailabilities                                           │ │
│  │  - recurringAppointments                                          │ │
│  │  - appointmentNotes                                               │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  Backup: Automated daily backups                                        │
│  Replication: 3-node replica set                                        │
│  Sharding: Ready for horizontal scaling                                 │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────┐  ┌──────────────────┐  ┌─────────────────────┐│
│  │  Razorpay           │  │  Cloudinary      │  │  Email/SMTP         ││
│  │  (Payment Gateway)  │  │  (Image Storage) │  │  (Notifications)    ││
│  │                     │  │                  │  │                     ││
│  │ - Process Payments  │  │ - Upload Images  │  │ - Send Emails       ││
│  │ - Verify Payment    │  │ - Transform      │  │ - OTP Delivery      ││
│  │ - Refunds           │  │ - Deliver Images │  │ - Notifications     ││
│  │ - Webhook Support   │  │ - CDN Delivery   │  │ - Confirmations     ││
│  │                     │  │                  │  │                     ││
│  └─────────────────────┘  └──────────────────┘  └─────────────────────┘│
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### User Registration Flow
```
┌─────────────┐
│ User enters │
│  details    │
└──────┬──────┘
       ▼
┌─────────────────────┐
│ Frontend validates  │
│ input               │
└──────┬──────────────┘
       ▼
┌─────────────────────────────────────┐
│ POST /api/user/register             │
│ {name, email, password}             │
└──────┬──────────────────────────────┘
       ▼
┌─────────────────────────────────────┐
│ Backend:                            │
│ - Validate input                    │
│ - Check email uniqueness            │
│ - Hash password (bcrypt)            │
│ - Create user in DB                 │
└──────┬──────────────────────────────┘
       ▼
┌─────────────────────────────────────┐
│ Return JWT token                    │
│ & user data                         │
└──────┬──────────────────────────────┘
       ▼
┌─────────────────────────────────────┐
│ Frontend:                           │
│ - Store token in localStorage       │
│ - Redirect to home                  │
│ - Load user profile                 │
└─────────────────────────────────────┘
```

### Appointment Booking Flow
```
┌──────────────────────┐
│ Patient selects      │
│ doctor & time        │
└────────┬─────────────┘
         ▼
┌──────────────────────────────────┐
│ Frontend checks availability     │
└────────┬─────────────────────────┘
         ▼
┌──────────────────────────────────────────────┐
│ POST /api/user/book-appointment              │
│ {docId, slotDate, slotTime, userId}         │
└────────┬─────────────────────────────────────┘
         ▼
┌──────────────────────────────────────────────┐
│ Backend:                                     │
│ - Authenticate user (JWT)                    │
│ - Check slot availability                    │
│ - Create appointment                         │
│ - Send notification to doctor                │
│ - Send email confirmation                    │
└────────┬─────────────────────────────────────┘
         ▼
┌──────────────────────────────────────────────┐
│ Return appointment details                   │
│ & booking confirmation                       │
└────────┬─────────────────────────────────────┘
         ▼
┌──────────────────────────────────────────────┐
│ Frontend:                                    │
│ - Show confirmation                          │
│ - Add to appointments list                   │
│ - Show payment option                        │
└──────────────────────────────────────────────┘
```

### Payment Processing Flow
```
┌───────────────────────┐
│ Patient clicks        │
│ "Pay Online"          │
└────────┬──────────────┘
         ▼
┌───────────────────────────────────────────┐
│ POST /api/user/payment-razorpay           │
│ {appointmentId}                           │
└────────┬──────────────────────────────────┘
         ▼
┌───────────────────────────────────────────┐
│ Backend:                                  │
│ - Create Razorpay order                   │
│ - Return order ID & amount                │
└────────┬──────────────────────────────────┘
         ▼
┌───────────────────────────────────────────┐
│ Frontend:                                 │
│ - Initialize Razorpay checkout            │
│ - Open payment modal                      │
└────────┬──────────────────────────────────┘
         ▼
    ┌────────────────────┐
    │ Patient enters     │
    │ payment details    │
    │ (in Razorpay)      │
    └────────┬───────────┘
             ▼
┌───────────────────────────────────────────┐
│ Razorpay processes payment                │
│ Returns callback to frontend              │
└────────┬──────────────────────────────────┘
         ▼
┌───────────────────────────────────────────┐
│ POST /api/user/verifyRazorpay             │
│ {razorpay_order_id, razorpay_payment_id}  │
└────────┬──────────────────────────────────┘
         ▼
┌───────────────────────────────────────────┐
│ Backend:                                  │
│ - Verify payment signature                │
│ - Update appointment (paid=true)          │
│ - Generate invoice                        │
│ - Send receipt email                      │
│ - Send confirmation to doctor             │
└────────┬──────────────────────────────────┘
         ▼
┌───────────────────────────────────────────┐
│ Frontend:                                 │
│ - Show success message                    │
│ - Update appointment status               │
│ - Show invoice download option            │
└───────────────────────────────────────────┘
```

### Message Exchange Flow
```
┌──────────────────────┐
│ Patient/Doctor types │
│ message              │
└────────┬─────────────┘
         ▼
┌────────────────────────────────────┐
│ Frontend validates message         │
│ (non-empty)                        │
└────────┬─────────────────────────┘
         ▼
┌─────────────────────────────────────────┐
│ POST /api/user/send-message             │
│ {conversationId, message, timestamp}    │
└────────┬──────────────────────────────────┘
         ▼
┌─────────────────────────────────────────┐
│ Backend:                                │
│ - Authenticate user                     │
│ - Create message in DB                  │
│ - Update conversation (lastMessage)     │
│ - Send real-time notification           │
└────────┬──────────────────────────────────┘
         ▼
┌─────────────────────────────────────────┐
│ Return message with timestamp           │
└────────┬──────────────────────────────────┘
         ▼
┌─────────────────────────────────────────┐
│ Frontend:                               │
│ - Display message in chat               │
│ - Show delivery status                  │
│ - Update conversation list              │
└─────────────────────────────────────────┘
         ▼
    ┌────────────────────────────────┐
    │ Recipient polls for new        │
    │ messages (or receives push     │
    │ notification)                  │
    │                                │
    │ Frontend fetches new messages  │
    │ and displays them              │
    └────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│              SECURITY LAYERS                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Layer 1: HTTPS/TLS                                      │
│  ├─ All communication encrypted                         │
│  └─ Certificate validation                              │
│                                                          │
│ Layer 2: CORS Policy                                    │
│  ├─ Whitelist origin domains                            │
│  └─ Control API access                                  │
│                                                          │
│ Layer 3: Input Validation                               │
│  ├─ Type checking                                       │
│  ├─ Length validation                                   │
│  ├─ Email format validation                             │
│  └─ SQL injection prevention                            │
│                                                          │
│ Layer 4: Authentication                                 │
│  ├─ JWT token generation                                │
│  ├─ Token expiration                                    │
│  ├─ Refresh token mechanism                             │
│  └─ Session management                                  │
│                                                          │
│ Layer 5: Authorization                                  │
│  ├─ Role-based access control (RBAC)                    │
│  ├─ User verification middleware                        │
│  └─ Protected routes                                    │
│                                                          │
│ Layer 6: Password Security                              │
│  ├─ Bcrypt hashing (10 rounds)                          │
│  ├─ Salt generation                                     │
│  └─ Comparison without timing attacks                   │
│                                                          │
│ Layer 7: Data Protection                                │
│  ├─ Sensitive data encryption                           │
│  ├─ PII masking in logs                                 │
│  └─ Secure file uploads                                 │
│                                                          │
│ Layer 8: External Services                              │
│  ├─ Razorpay payment encryption                         │
│  ├─ Cloudinary secure URLs                              │
│  └─ Email service authentication                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Architecture

```
Current Setup:
┌──────────────────────────────────────────┐
│          Single Server Instance          │
│  ┌─────────────────────────────────────┐ │
│  │ Frontend (React + Vite)   :5173    │ │
│  │ Backend (Express)         :4000    │ │
│  │ Admin (React + Vite)      :5174    │ │
│  │ MongoDB Local/Cloud                │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘

Future Scalable Setup:
┌──────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER                              │
│              (Nginx / AWS ALB / CloudFlare)                   │
└──────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │  Instance 1  │   │  Instance 2  │   │  Instance N  │
   │  Backend API │   │  Backend API │   │  Backend API │
   │   (Node.js)  │   │   (Node.js)  │   │   (Node.js)  │
   └──────────────┘   └──────────────┘   └──────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
                  ┌──────────────────────┐
                  │   MongoDB Cluster    │
                  │  (Sharded & Replicas)│
                  └──────────────────────┘
                              ▼
                  ┌──────────────────────┐
                  │  Redis Cache Layer   │
                  │  (Session & Data)    │
                  └──────────────────────┘

Frontend CDN Delivery:
┌──────────────────────────────────────────────────────────────┐
│                        CDN Network                            │
│                   (Vercel / Netlify)                         │
│                                                               │
│  Edge Servers worldwide                                      │
│  - Patient Portal (React)                                    │
│  - Admin Dashboard (React)                                   │
│  - Static Assets                                             │
│  - API Caching                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Deployment Architecture

```
Development Environment:
├─ Local MongoDB
├─ Test API Keys (Razorpay, Cloudinary)
├─ Dev Database
└─ Hot Reload Enabled

Production Environment:
├─ MongoDB Atlas (Cloud)
├─ Production API Keys
├─ Backup Database
├─ CloudFlare CDN
├─ SSL/TLS Certificates
├─ Environment Variable Vault
├─ Monitoring & Logging
│  ├─ Error Tracking (Sentry)
│  ├─ Performance Monitoring (New Relic)
│  └─ Log Aggregation (ELK Stack)
└─ Auto-scaling & Failover
   ├─ Kubernetes Orchestration
   ├─ Auto-recovery
   └─ Load Balancing
```

---

## 🎯 Component Interaction Map

```
                        ┌─────────────┐
                        │   Navbar    │
                        └──────┬──────┘
           ┌────────────────────┼─────────────────────┐
           ▼                    ▼                      ▼
    ┌─────────────┐      ┌──────────────┐      ┌─────────────┐
    │ User Auth   │      │ Navigation   │      │ Profile     │
    │ Context     │      │ State        │      │ Dropdown    │
    └──────┬──────┘      └──────────────┘      └─────────────┘
           │
    ┌──────┴───────────────────────────────────────────────┐
    │                                                       │
    ▼                                                       ▼
┌─────────────────┐                              ┌──────────────────┐
│ Main Pages      │                              │ Profile Pages    │
├─────────────────┤                              ├──────────────────┤
│ - Home          │                              │ - MyProfile      │
│ - Doctors       │                              │ - MyAppointment  │
│ - Appointment   │                              │ - Messages       │
│ - About         │                              │ - Notifications  │
│ - Contact       │                              │ - Invoices       │
└─────────────────┘                              └──────────────────┘
    │                                                     │
    └──────────────────────────┬──────────────────────────┘
                               ▼
                    ┌────────────────────┐
                    │  API Context       │
                    │  (Backend URL      │
                    │   Token Auth)      │
                    └────────┬───────────┘
                             ▼
                    ┌────────────────────┐
                    │  Express Server    │
                    │  Port 4000         │
                    └────────┬───────────┘
                             ▼
                    ┌────────────────────┐
                    │  Controllers       │
                    │  (Business Logic)  │
                    └────────┬───────────┘
                             ▼
                    ┌────────────────────┐
                    │  MongoDB Models    │
                    │  & Queries         │
                    └────────┬───────────┘
                             ▼
                    ┌────────────────────┐
                    │  MongoDB Database  │
                    │  (Cloud)           │
                    └────────────────────┘
```

---

## 📊 Technology Stack Summary

```
Frontend Stack:
├─ React 18+ (UI Framework)
├─ Vite (Build Tool)
├─ Tailwind CSS (Styling)
├─ Axios (HTTP Client)
├─ React Router (Navigation)
├─ React Toastify (Notifications)
└─ Lucide Icons (Icons)

Backend Stack:
├─ Node.js (Runtime)
├─ Express.js (Framework)
├─ MongoDB (Database)
├─ Mongoose (ODM)
├─ JWT (Authentication)
├─ Bcrypt (Password Hashing)
├─ Multer (File Upload)
├─ Nodemailer (Email)
└─ Dotenv (Config)

External Services:
├─ Razorpay (Payments)
├─ Cloudinary (Image Storage)
├─ MongoDB Atlas (Cloud DB)
└─ SMTP Provider (Email)

DevOps & Deployment:
├─ Docker (Containerization)
├─ Vercel/Netlify (Frontend)
├─ Heroku/Railway (Backend)
├─ GitHub (Version Control)
└─ CI/CD Pipeline (Automation)

Monitoring & Analytics:
├─ Sentry (Error Tracking)
├─ New Relic (Performance)
├─ Google Analytics (User Behavior)
└─ Datadog (Infrastructure)
```

---

This architecture provides a solid foundation for a scalable, secure, and performant healthcare management platform.
