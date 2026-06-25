import otpModel from "../models/otpModel.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email required" });
        }

        const recentOTP = await otpModel.findOne({ email, createdAt: { $gt: Date.now() - 2 * 60 * 1000 } });

        if (recentOTP && recentOTP.attempts < 3) {
            return res.json({ success: false, message: "OTP already sent. Please try after 2 minutes." });
        }

        const otp = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        await otpModel.deleteMany({ email });
        await otpModel.create({
            email,
            otp,
            expiresAt,
            createdAt: Date.now()
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'MediSync OTP - Two Factor Authentication',
            html: `
                <h2>Two Factor Authentication</h2>
                <p>Your OTP for MediSync login is:</p>
                <h1 style="color: #007bff; letter-spacing: 3px;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
                <p>Do not share this OTP with anyone.</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: "OTP sent to your email" });
        } catch (emailError) {
            res.json({ success: true, message: "OTP generated (demo mode)", otp });
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP required" });
        }

        const otpRecord = await otpModel.findOne({ email });

        if (!otpRecord) {
            return res.json({ success: false, message: "OTP not found or expired" });
        }

        if (otpRecord.expiresAt < Date.now()) {
            await otpModel.findByIdAndDelete(otpRecord._id);
            return res.json({ success: false, message: "OTP has expired" });
        }

        if (otpRecord.attempts >= 5) {
            await otpModel.findByIdAndDelete(otpRecord._id);
            return res.json({ success: false, message: "Too many attempts. Request a new OTP." });
        }

        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return res.json({ success: false, message: "Invalid OTP" });
        }

        otpRecord.verified = true;
        await otpRecord.save();

        res.json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const isOTPVerified = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email required" });
        }

        const otpRecord = await otpModel.findOne({ email, verified: true, expiresAt: { $gt: Date.now() } });

        if (otpRecord) {
            res.json({ success: true, verified: true });
        } else {
            res.json({ success: true, verified: false });
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { sendOTP, verifyOTP, isOTPVerified };
