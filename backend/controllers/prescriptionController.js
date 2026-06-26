import prescriptionModel from "../models/prescriptionModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import notificationModel from "../models/notificationModel.js";

const addPrescription = async (req, res) => {
  try {
    const { appointmentId, medications, diagnosis, notes } = req.body;
    const docId = req.user;

    if (!appointmentId || !medications || !diagnosis) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId !== docId) {
      return res.json({ success: false, message: "Invalid appointment" });
    }

    if (appointment.payment === false) {
      return res.json({ success: false, message: "Appointment payment not received" });
    }

    const prescription = new prescriptionModel({
      appointmentId,
      docId,
      userId: appointment.userId,
      medications,
      diagnosis,
      notes,
      date: Date.now(),
      expiryDate: Date.now() + 90 * 24 * 60 * 60 * 1000
    });

    await prescription.save();

    // Create notification for patient
    await notificationModel.create({
      userId: appointment.userId,
      title: "New Prescription from Doctor",
      message: `Dr. has added a new prescription for your appointment on ${new Date(appointment.slotDate).toLocaleDateString()}`,
      type: "prescription",
      relatedId: prescription._id,
      isRead: false,
      createdAt: Date.now()
    });

    res.json({ success: true, message: "Prescription added successfully", prescription });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getUserPrescriptions = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID required" });
    }

    const prescriptions = await prescriptionModel
      .find({ userId })
      .sort({ date: -1 });

    // Add doctor details to each prescription
    const enrichedPrescriptions = await Promise.all(prescriptions.map(async (presc) => {
      const doctor = await doctorModel.findById(presc.docId);
      return {
        ...presc.toObject(),
        doctorName: doctor?.name || 'Unknown Doctor',
        doctorSpeciality: doctor?.speciality || 'General'
      };
    }));

    res.json({ success: true, prescriptions: enrichedPrescriptions });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getPrescription = async (req, res) => {
  try {
    const { userId, prescriptionId } = req.body;

    if (!prescriptionId) {
      return res.json({ success: false, message: "Prescription ID required" });
    }

    const prescription = await prescriptionModel.findById(prescriptionId);
    
    if (!prescription || prescription.userId !== userId) {
      return res.json({ success: false, message: "Prescription not found" });
    }

    const doctor = await doctorModel.findById(prescription.docId);

    res.json({ 
      success: true, 
      prescription: {
        ...prescription.toObject(),
        doctorName: doctor?.name || 'Unknown Doctor',
        doctorSpeciality: doctor?.speciality || 'General'
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getDoctorPrescriptions = async (req, res) => {
  try {
    const docId = req.user;
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({ success: false, message: "Appointment ID required" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId !== docId) {
      return res.json({ success: false, message: "Invalid appointment" });
    }

    const prescription = await prescriptionModel.findOne({ appointmentId });
    
    if (prescription) {
      res.json({ success: true, prescription, exists: true });
    } else {
      res.json({ success: true, exists: false, message: "No prescription for this appointment" });
    }

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addPrescription, getUserPrescriptions, getPrescription, getDoctorPrescriptions };
