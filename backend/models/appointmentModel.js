import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    cancellationReason: { type: String, default: "" },
    cancellationDate: { type: Number, default: null },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Number, default: null },
    rescheduled: { type: Boolean, default: false },
    rescheduleHistory: [{
        oldDate: { type: String },
        oldTime: { type: String },
        newDate: { type: String },
        newTime: { type: String },
        rescheduleDate: { type: Number }
    }],
    notes: { type: String, default: "" },
    reminder: { type: Boolean, default: true },
    reminderSent: { type: Boolean, default: false }
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel