import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'online', 'wallet'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  invoiceNumber: { type: String, unique: true },
  issueDate: { type: Number, default: Date.now },
  dueDate: { type: Number },
  items: [{
    description: String,
    quantity: Number,
    rate: Number
  }],
  notes: String
}, { timestamps: true });

const invoiceModel = mongoose.models.invoice || mongoose.model("invoice", invoiceSchema);
export default invoiceModel;
