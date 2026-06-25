import express from 'express';
import { loginDoctor, appointmentsDoctor, appointmentCancel, doctorList, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile, changeAvailability } from '../controllers/doctorController.js';
import { addPrescription, getUserPrescriptions } from '../controllers/prescriptionController.js';
import { setAvailability, getAvailability, addHoliday, removeHoliday, getAvailableSlots } from '../controllers/availabilityController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

// Doctor Auth Routes
doctorRouter.post("/login", loginDoctor)

// Appointment Management
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)

// Prescription Management
doctorRouter.post("/create-prescription", authDoctor, addPrescription)
doctorRouter.get("/prescriptions", authDoctor, getUserPrescriptions)

// Profile Management
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)

// Availability Management
doctorRouter.post("/set-availability", authDoctor, setAvailability)
doctorRouter.post("/get-availability", authDoctor, getAvailability)
doctorRouter.post("/add-holiday", authDoctor, addHoliday)
doctorRouter.post("/remove-holiday", authDoctor, removeHoliday)
doctorRouter.post("/get-available-slots", getAvailableSlots)

// Doctor List (Public)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailability)

export default doctorRouter;