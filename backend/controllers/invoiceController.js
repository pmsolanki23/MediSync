import invoiceModel from "../models/invoiceModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";

const generateInvoiceNumber = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${timestamp}-${random}`;
};

const createInvoice = async (req, res) => {
    try {
        const { appointmentId, paymentMethod = 'razorpay', userId, docId, amount } = req.body;

        if (!appointmentId || !amount) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const existing = await invoiceModel.findOne({ appointmentId });
        if (existing) {
            return res.json({ success: false, message: "Invoice already exists for this appointment" });
        }

        const invoiceNumber = generateInvoiceNumber();
        const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime();

        const invoiceData = {
            appointmentId,
            userId,
            docId,
            invoiceNumber,
            amount,
            paymentMethod,
            issueDate: Date.now(),
            dueDate,
        };

        const invoice = await invoiceModel.create(invoiceData);

        res.json({ success: true, message: "Invoice created", invoice });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getUserInvoices = async (req, res) => {
    try {
        const { userId, status = 'all', page = 1, limit = 10 } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID required" });
        }

        const skip = (page - 1) * limit;

        let query = { userId };
        if (status && status !== 'all') {
            query.status = status;
        }

        const invoices = await invoiceModel
            .find(query)
            .sort({ issueDate: -1 })
            .skip(skip)
            .limit(limit);

        // Enrich with appointment and doctor details
        const enrichedInvoices = await Promise.all(invoices.map(async (inv) => {
            const appointment = await appointmentModel.findById(inv.appointmentId);
            const doctor = await doctorModel.findById(inv.docId);
            return {
                ...inv.toObject(),
                appointmentDetails: appointment,
                doctorName: doctor?.name || 'N/A',
                doctorSpeciality: doctor?.speciality || 'N/A'
            };
        }));

        const total = await invoiceModel.countDocuments(query);

        res.json({ 
            success: true, 
            invoices: enrichedInvoices,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getInvoice = async (req, res) => {
    try {
        const { userId, invoiceId } = req.body;

        if (!invoiceId) {
            return res.json({ success: false, message: "Invoice ID required" });
        }

        const invoice = await invoiceModel.findById(invoiceId);

        if (!invoice || invoice.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const appointment = await appointmentModel.findById(invoice.appointmentId);
        const doctor = await doctorModel.findById(invoice.docId);

        res.json({ 
            success: true, 
            invoice: {
                ...invoice.toObject(),
                doctorName: doctor?.name || 'N/A',
                doctorSpeciality: doctor?.speciality || 'N/A'
            },
            appointment 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const markInvoiceAsPaid = async (req, res) => {
    try {
        const { userId, invoiceId, paymentId } = req.body;

        if (!invoiceId) {
            return res.json({ success: false, message: "Invoice ID required" });
        }

        const invoice = await invoiceModel.findById(invoiceId);

        if (!invoice || invoice.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        await invoiceModel.findByIdAndUpdate(invoiceId, {
            status: 'paid',
        });

        res.json({ success: true, message: "Invoice marked as paid" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getInvoiceStats = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID required" });
        }

        const invoices = await invoiceModel.find({ userId });

        const stats = {
            total: invoices.length,
            paid: invoices.filter(i => i.status === 'paid').length,
            pending: invoices.filter(i => i.status === 'pending').length,
            refunded: invoices.filter(i => i.status === 'refunded').length,
            totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
            paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
            pendingAmount: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
        };

        res.json({ success: true, stats });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const downloadInvoice = async (req, res) => {
    try {
        const { userId, invoiceId } = req.body;

        if (!invoiceId) {
            return res.json({ success: false, message: "Invoice ID required" });
        }

        const invoice = await invoiceModel.findById(invoiceId);

        if (!invoice || invoice.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const appointment = await appointmentModel.findById(invoice.appointmentId);
        const doctor = await doctorModel.findById(invoice.docId);

        res.json({ 
            success: true, 
            message: "Invoice ready for download", 
            invoice: {
                ...invoice.toObject(),
                doctorName: doctor?.name || 'N/A',
                doctorSpeciality: doctor?.speciality || 'N/A'
            },
            appointment 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { createInvoice, getUserInvoices, getInvoice, markInvoiceAsPaid, getInvoiceStats, downloadInvoice };
