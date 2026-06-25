import walletModel from "../models/walletModel.js";

const getWallet = async (req, res) => {
  try {
    const { userId } = req.headers;

    let wallet = await walletModel.findOne({ userId });
    
    if (!wallet) {
      wallet = new walletModel({ userId });
      await wallet.save();
    }

    res.json({ success: true, wallet });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const addFunds = async (req, res) => {
  try {
    const { userId } = req.headers;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.json({ success: false, message: "Invalid amount" });
    }

    let wallet = await walletModel.findOne({ userId });
    if (!wallet) {
      wallet = new walletModel({ userId });
    }

    wallet.balance += amount;
    wallet.transactions.push({
      type: 'credit',
      amount,
      description: 'Funds added',
      date: Date.now()
    });

    await wallet.save();
    res.json({ success: true, message: "Funds added successfully", wallet });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const useWalletForAppointment = async (req, res) => {
  try {
    const { userId } = req.headers;
    const { amount } = req.body;

    let wallet = await walletModel.findOne({ userId });
    
    if (!wallet || wallet.balance < amount) {
      return res.json({ success: false, message: "Insufficient wallet balance" });
    }

    wallet.balance -= amount;
    wallet.transactions.push({
      type: 'debit',
      amount,
      description: 'Appointment payment',
      date: Date.now()
    });

    await wallet.save();
    res.json({ success: true, message: "Payment successful", wallet });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getReferralCode = async (req, res) => {
  try {
    const { userId } = req.headers;

    let wallet = await walletModel.findOne({ userId });
    if (!wallet) {
      wallet = new walletModel({ userId });
    }

    if (!wallet.referralCode) {
      wallet.referralCode = `MED${userId.slice(-6).toUpperCase()}`;
      await wallet.save();
    }

    res.json({ success: true, referralCode: wallet.referralCode });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getWallet, addFunds, useWalletForAppointment, getReferralCode };
