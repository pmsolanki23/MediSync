import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Number, required: true },
    attempts: { type: Number, default: 0, max: 5 },
    verified: { type: Boolean, default: false },
    createdAt: { type: Number, required: true }
});

// Auto delete OTP documents after 10 minutes
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const otpModel = mongoose.models.otp || mongoose.model("otp", otpSchema);
export default otpModel;
