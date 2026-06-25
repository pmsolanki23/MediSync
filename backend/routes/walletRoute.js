import express from 'express';
import { getWallet, addFunds, useWalletForAppointment, getReferralCode } from '../controllers/walletController.js';
import authUser from '../middlewares/authUser.js';

const walletRouter = express.Router();

walletRouter.get('/get', authUser, getWallet);
walletRouter.post('/add-funds', authUser, addFunds);
walletRouter.post('/use-for-appointment', authUser, useWalletForAppointment);
walletRouter.get('/referral-code', authUser, getReferralCode);

export default walletRouter;
