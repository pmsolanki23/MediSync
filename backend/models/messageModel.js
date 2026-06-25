import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  docId: { type: String, required: true },
  userId: { type: String, required: true },
  sender: { type: String, enum: ['doctor', 'patient'], required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Number, required: true }
}, { timestamps: true });

messageSchema.index({ chatId: 1, date: -1 });

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);
export default messageModel;
