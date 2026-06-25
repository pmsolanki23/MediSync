import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
    referrerId: { type: String, required: true },
    referralCode: { type: String, required: true, unique: true },
    referralBonus: { type: Number, default: 500 },
    signupBonus: { type: Number, default: 300 },
    referrals: [{
        referredUserId: { type: String, required: true },
        referredEmail: { type: String, required: true },
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        bonusAwarded: { type: Boolean, default: false },
        date: { type: Number, required: true }
    }],
    totalBonusEarned: { type: Number, default: 0 },
    createdAt: { type: Number, required: true }
});

const referralModel = mongoose.models.referral || mongoose.model("referral", referralSchema);
export default referralModel;
