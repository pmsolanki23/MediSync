import prescriptionModel from "../models/prescriptionModel.js";
import appointmentModel from "../models/appointmentModel.js";

const addPrescription = async (req, res) => {
  try {
    const { appointmentId, medications, diagnosis, notes } = req.body;
    const { docId } = req.headers;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId !== docId) {
      return res.json({ success: false, message: "Invalid appointment" });
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
    res.json({ success: true, message: "Prescription added", prescription });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getUserPrescriptions = async (req, res) => {
  try {
    const { userId } = req.headers;

    const prescriptions = await prescriptionModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({ success: true, prescriptions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { userId } = req.headers;

    const prescription = await prescriptionModel.findById(prescriptionId);
    
    if (!prescription || prescription.userId !== userId) {
      return res.json({ success: false, message: "Prescription not found" });
    }

    res.json({ success: true, prescription });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addPrescription, getUserPrescriptions, getPrescription };
