import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{ type: String, required: true }],
    participantNames: { type: Map, of: String },
    participantImages: { type: Map, of: String },
    lastMessage: { type: String, default: "" },
    lastMessageTime: { type: Number, default: 0 },
    lastMessageSenderId: { type: String, default: "" },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true }
});

conversationSchema.index({ participants: 1 });

const conversationModel = mongoose.models.conversation || mongoose.model("conversation", conversationSchema);
export default conversationModel;
