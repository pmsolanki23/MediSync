# MediSync Features - Complete Fix Plan

## Issues Identified

### 1. INVOICES
**Issues Found:**
- Invoice doesn't auto-create when appointment is booked
- Invoice creation requires manual trigger
- No integration with payment workflow
- Download endpoint sends data but client prints hard-coded format

**Required Fixes:**
- [ ] Auto-create invoice when appointment is successfully booked and paid
- [ ] Link invoice creation to payment completion (Razorpay/Stripe)
- [ ] Ensure invoice status updates when payment is verified
- [ ] Fix invoice PDF download to show real appointment data

### 2. MESSAGES
**Issues Found:**
- ChatComponent sends wrong field names to API (uses 'message' instead of 'content')
- API expects 'recipientId' in body, ChatComponent doesn't provide it correctly
- conversationId parsing is incorrect in ChatComponent
- Message field naming inconsistency

**Required Fixes:**
- [ ] Fix ChatComponent to use correct API field names
- [ ] Fix conversationId extraction logic
- [ ] Ensure proper recipient ID handling
- [ ] Test message send/receive flow

### 3. NOTIFICATIONS
**Issues Found:**
- NotificationCenter checks for 'read' field but model stores 'isRead'
- Frontend inconsistency in field naming
- Notification creation doesn't happen automatically for key events

**Required Fixes:**
- [ ] Fix NotificationCenter to use 'isRead' instead of 'read'
- [ ] Auto-create notifications for: new appointments, appointment cancellations, prescriptions
- [ ] Update notification read status properly

### 4. PRESCRIPTIONS
**Issues Found:**
- Doctor routes don't export prescription endpoints
- Prescription route file not registered in server.js
- Frontend AddPrescriptionComponent may not be integrated
- No automatic trigger for prescription creation after appointment

**Required Fixes:**
- [ ] Register prescription routes in server.js
- [ ] Expose prescription creation endpoint in doctor routes
- [ ] Add prescription creation trigger after appointment completion
- [ ] Test prescription retrieval and display

## Implementation Order

1. Fix message sending (API contract issues)
2. Fix notification field naming
3. Fix and integrate prescription routes
4. Auto-create invoices on payment
5. Add automatic event-triggered notifications
6. Test complete workflows

