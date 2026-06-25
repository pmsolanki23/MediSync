import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    userName: { type: String, required: true },
    userImage: { type: String, default: "" },
    docName: { type: String, required: true },
    docImage: { type: String, default: "" },
    lastMessage: { type: String, default: "" },
    lastMessageTime: { type: Number, default: 0 },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true }
});

conversationSchema.index({ userId: 1, docId: 1 }, { unique: true });

const conversationModel = mongoose.models.conversation || mongoose.model("conversation", conversationSchema);
export default conversationModel;
