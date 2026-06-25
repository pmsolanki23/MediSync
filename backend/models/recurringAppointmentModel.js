import mongoose from "mongoose";

const recurringAppointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'], required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, default: null },
    slotTime: { type: String, required: true },
    dayOfWeek: { type: Number, default: null }, // 0-6 for weekly
    dayOfMonth: { type: Number, default: null }, // 1-31 for monthly
    maxOccurrences: { type: Number, default: null },
    occurrencesCreated: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    notes: { type: String, default: "" },
    createdAt: { type: Number, required: true }
});

const recurringAppointmentModel = mongoose.models.recurringAppointment || mongoose.model("recurringAppointment", recurringAppointmentSchema);
export default recurringAppointmentModel;
