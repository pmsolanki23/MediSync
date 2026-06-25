import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [{
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    description: String,
    appointmentId: String,
    date: { type: Number, required: true }
  }],
  referralCode: { type: String, unique: true },
  referrals: [{ type: String }]
}, { timestamps: true });

const walletModel = mongoose.models.wallet || mongoose.model("wallet", walletSchema);
export default walletModel;
