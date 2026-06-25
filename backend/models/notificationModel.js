import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['appointment', 'prescription', 'payment', 'message', 'system'], default: 'system' },
    relatedId: { type: String, default: "" },
    read: { type: Boolean, default: false },
    createdAt: { type: Number, required: true }
});

const notificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema);
export default notificationModel;
