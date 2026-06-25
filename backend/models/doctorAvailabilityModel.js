import mongoose from "mongoose";

const doctorAvailabilitySchema = new mongoose.Schema({
    docId: { type: String, required: true, unique: true },
    availability: [{
        dayOfWeek: { type: Number, required: true }, // 0-6 (Sunday-Saturday)
        startTime: { type: String, required: true }, // HH:MM format
        endTime: { type: String, required: true },
        slotDuration: { type: Number, default: 30 }, // in minutes
        isAvailable: { type: Boolean, default: true }
    }],
    holidays: [{
        date: { type: Number, required: true },
        reason: { type: String, default: "" }
    }],
    updatedAt: { type: Number, required: true }
});

const doctorAvailabilityModel = mongoose.models.doctorAvailability || mongoose.model("doctorAvailability", doctorAvailabilitySchema);
export default doctorAvailabilityModel;
