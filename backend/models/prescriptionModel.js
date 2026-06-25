import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  docId: { type: String, required: true },
  userId: { type: String, required: true },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    notes: String
  }],
  diagnosis: { type: String, required: true },
  notes: { type: String },
  date: { type: Number, required: true },
  expiryDate: { type: Number }
}, { timestamps: true });

const prescriptionModel = mongoose.models.prescription || mongoose.model("prescription", prescriptionSchema);
export default prescriptionModel;
