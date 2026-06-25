import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentNoteModel from "../models/appointmentNoteModel.js";
import recurringAppointmentModel from "../models/recurringAppointmentModel.js";
import invoiceModel from "../models/invoiceModel.js";
import notificationModel from "../models/notificationModel.js";
import validator from 'validator';

const rescheduleAppointment = async (req, res) => {
    try {
        const { userId, appointmentId, newDate, newTime } = req.body;

        if (!appointmentId || !newDate || !newTime) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment || appointment.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        if (appointment.cancelled) {
            return res.json({ success: false, message: "Cannot reschedule cancelled appointment" });
        }

        const doctor = await doctorModel.findById(appointment.docId);

        let slots_booked = doctor.slots_booked;
        if (slots_booked[newDate] && slots_booked[newDate].includes(newTime)) {
            return res.json({ success: false, message: "Selected slot not available" });
        }

        slots_booked[appointment.slotDate] = slots_booked[appointment.slotDate].filter(
            e => e !== appointment.slotTime
        );

        if (slots_booked[newDate]) {
            slots_booked[newDate].push(newTime);
        } else {
            slots_booked[newDate] = [newTime];
        }

        const rescheduleEntry = {
            oldDate: appointment.slotDate,
            oldTime: appointment.slotTime,
            newDate,
            newTime,
            rescheduleDate: Date.now()
        };

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            slotDate: newDate,
            slotTime: newTime,
            rescheduled: true,
            $push: { rescheduleHistory: rescheduleEntry }
        });

        await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked });

        await notificationModel.create({
            userId,
            title: "Appointment Rescheduled",
            message: `Your appointment has been rescheduled to ${newDate} at ${newTime}`,
            type: "appointment",
            relatedId: appointmentId,
            createdAt: Date.now()
        });

        res.json({ success: true, message: "Appointment rescheduled successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const addAppointmentNote = async (req, res) => {
    try {
        const { userId, appointmentId, note, createdBy } = req.body;

        if (!appointmentId || !note || !createdBy) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (createdBy === "user" && appointment.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const noteData = {
            appointmentId,
            userId: appointment.userId,
            docId: appointment.docId,
            note,
            createdBy,
            createdAt: Date.now()
        };

        await appointmentNoteModel.create(noteData);
        res.json({ success: true, message: "Note added successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getAppointmentNotes = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const notes = await appointmentNoteModel.find({ appointmentId }).sort({ createdAt: -1 });
        res.json({ success: true, notes });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const bookRecurringAppointment = async (req, res) => {
    try {
        const { userId, docId, frequency, startDate, slotTime, endDate, maxOccurrences, notes } = req.body;

        if (!userId || !docId || !frequency || !startDate || !slotTime) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!['weekly', 'biweekly', 'monthly'].includes(frequency)) {
            return res.json({ success: false, message: "Invalid frequency" });
        }

        const startDateObj = new Date(startDate);
        const dayOfWeek = startDateObj.getDay();
        const dayOfMonth = startDateObj.getDate();

        const recurringData = {
            userId,
            docId,
            frequency,
            startDate: new Date(startDate).getTime(),
            endDate: endDate ? new Date(endDate).getTime() : null,
            slotTime,
            dayOfWeek: frequency === 'weekly' ? dayOfWeek : null,
            dayOfMonth: frequency === 'monthly' ? dayOfMonth : null,
            maxOccurrences: maxOccurrences || null,
            notes: notes || "",
            createdAt: Date.now()
        };

        const recurring = await recurringAppointmentModel.create(recurringData);

        const doctor = await doctorModel.findById(docId);
        const user = await (require('../models/userModel.js').default).findById(userId);

        let slots_booked = doctor.slots_booked;
        const slotDateStr = startDate;

        if (slots_booked[slotDateStr]) {
            slots_booked[slotDateStr].push(slotTime);
        } else {
            slots_booked[slotDateStr] = [slotTime];
        }

        const appointmentData = {
            userId,
            docId,
            userData: user,
            docData: doctor,
            slotDate: slotDateStr,
            slotTime,
            amount: doctor.fees,
            date: Date.now(),
            notes: `Recurring appointment (${frequency})`
        };

        await appointmentModel.create(appointmentData);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Recurring appointment booked", recurringId: recurring._id });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getRecurringAppointments = async (req, res) => {
    try {
        const { userId } = req.body;

        const recurring = await recurringAppointmentModel.find({ userId, active: true });
        res.json({ success: true, recurring });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const cancelRecurringAppointment = async (req, res) => {
    try {
        const { userId, recurringId } = req.body;

        if (!recurringId) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const recurring = await recurringAppointmentModel.findById(recurringId);

        if (!recurring || recurring.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        await recurringAppointmentModel.findByIdAndUpdate(recurringId, { active: false });

        res.json({ success: true, message: "Recurring appointment cancelled" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { rescheduleAppointment, addAppointmentNote, getAppointmentNotes, bookRecurringAppointment, getRecurringAppointments, cancelRecurringAppointment };
