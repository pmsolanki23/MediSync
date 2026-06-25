import referralModel from "../models/referralModel.js";
import userModel from "../models/userModel.js";
import walletModel from "../models/walletModel.js";
import crypto from 'crypto';

const generateReferralCode = () => {
    return 'MED' + crypto.randomBytes(6).toString('hex').toUpperCase();
};

const createReferral = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID required" });
        }

        let referral = await referralModel.findOne({ referrerId: userId });

        if (!referral) {
            const referralCode = generateReferralCode();

            referral = await referralModel.create({
                referrerId: userId,
                referralCode,
                referralBonus: 500,
                signupBonus: 300,
                createdAt: Date.now()
            });

            await userModel.findByIdAndUpdate(userId, { referralCode });
        }

        res.json({ success: true, referral });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getReferralByCode = async (req, res) => {
    try {
        const { referralCode } = req.body;

        if (!referralCode) {
            return res.json({ success: false, message: "Referral code required" });
        }

        const referral = await referralModel.findOne({ referralCode });

        if (!referral) {
            return res.json({ success: false, message: "Invalid referral code" });
        }

        res.json({ success: true, referral });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const applyReferralCode = async (req, res) => {
    try {
        const { newUserId, referralCode } = req.body;

        if (!newUserId || !referralCode) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const referral = await referralModel.findOne({ referralCode });

        if (!referral) {
            return res.json({ success: false, message: "Invalid referral code" });
        }

        const user = await userModel.findById(newUserId);
        if (user.referredBy) {
            return res.json({ success: false, message: "You already have a referral bonus applied" });
        }

        referral.referrals.push({
            referredUserId: newUserId,
            referredEmail: user.email,
            status: 'completed',
            bonusAwarded: false,
            date: Date.now()
        });

        let wallet = await walletModel.findOne({ userId: newUserId });

        if (!wallet) {
            wallet = await walletModel.create({
                userId: newUserId,
                balance: referral.signupBonus,
                transactions: [{
                    type: 'credit',
                    amount: referral.signupBonus,
                    description: 'Referral signup bonus',
                    date: Date.now()
                }],
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        } else {
            wallet.balance += referral.signupBonus;
            wallet.transactions.push({
                type: 'credit',
                amount: referral.signupBonus,
                description: 'Referral signup bonus',
                date: Date.now()
            });
            wallet.updatedAt = Date.now();
            await wallet.save();
        }

        referral.totalBonusEarned += referral.referralBonus;
        
        let referrerWallet = await walletModel.findOne({ userId: referral.referrerId });

        if (!referrerWallet) {
            referrerWallet = await walletModel.create({
                userId: referral.referrerId,
                balance: referral.referralBonus,
                transactions: [{
                    type: 'credit',
                    amount: referral.referralBonus,
                    description: 'Referral bonus',
                    date: Date.now()
                }],
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        } else {
            referrerWallet.balance += referral.referralBonus;
            referrerWallet.transactions.push({
                type: 'credit',
                amount: referral.referralBonus,
                description: 'Referral bonus',
                date: Date.now()
            });
            referrerWallet.updatedAt = Date.now();
            await referrerWallet.save();
        }

        referral.referrals[referral.referrals.length - 1].bonusAwarded = true;
        await referral.save();

        await userModel.findByIdAndUpdate(newUserId, { 
            referredBy: referral.referrerId,
            walletBalance: wallet.balance
        });

        await userModel.findByIdAndUpdate(referral.referrerId, { 
            walletBalance: referrerWallet.balance
        });

        res.json({ 
            success: true, 
            message: "Referral code applied successfully",
            bonusAwarded: referral.signupBonus
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getReferralStats = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID required" });
        }

        const referral = await referralModel.findOne({ referrerId: userId });

        if (!referral) {
            return res.json({ success: true, stats: {
                referralCode: '',
                totalReferrals: 0,
                completedReferrals: 0,
                totalBonusEarned: 0
            }});
        }

        const completedReferrals = referral.referrals.filter(r => r.status === 'completed').length;

        res.json({ 
            success: true, 
            stats: {
                referralCode: referral.referralCode,
                totalReferrals: referral.referrals.length,
                completedReferrals,
                totalBonusEarned: referral.totalBonusEarned,
                referralsList: referral.referrals
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { createReferral, getReferralByCode, applyReferralCode, getReferralStats };
