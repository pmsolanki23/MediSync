import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";

const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId, newSlotDate, newSlotTime } = req.body;
    const { userId } = req.headers;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.userId !== userId) {
      return res.json({ success: false, message: "Invalid appointment" });
    }

    if (appointment.cancelled) {
      return res.json({ success: false, message: "Cannot reschedule cancelled appointment" });
    }

    if (appointment.isCompleted) {
      return res.json({ success: false, message: "Cannot reschedule completed appointment" });
    }

    const docData = await doctorModel.findById(appointment.docId);

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[newSlotDate] && slots_booked[newSlotDate].includes(newSlotTime)) {
      return res.json({ success: false, message: "New slot not available" });
    }

    if (slots_booked[appointment.slotDate]) {
      slots_booked[appointment.slotDate] = slots_booked[appointment.slotDate].filter(
        (time) => time !== appointment.slotTime
      );
    }

    if (!slots_booked[newSlotDate]) {
      slots_booked[newSlotDate] = [];
    }
    slots_booked[newSlotDate].push(newSlotTime);

    appointment.slotDate = newSlotDate;
    appointment.slotTime = newSlotTime;
    await appointment.save();

    await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked });

    res.json({ success: true, message: "Appointment rescheduled successfully", appointment });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { rescheduleAppointment };
