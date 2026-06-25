import mongoose from "mongoose";

const appointmentNoteSchema = new mongoose.Schema({
    appointmentId: { type: String, required: true },
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    note: { type: String, required: true },
    createdBy: { type: String, enum: ['user', 'doctor'], required: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, default: null }
});

const appointmentNoteModel = mongoose.models.appointmentNote || mongoose.model("appointmentNote", appointmentNoteSchema);
export default appointmentNoteModel;
