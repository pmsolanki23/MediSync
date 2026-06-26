import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'conversation', required: true },
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, required: true }
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: -1 });

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);
export default messageModel;
