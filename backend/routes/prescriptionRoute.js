import express from 'express';
import { addPrescription, getDoctorPrescriptions } from '../controllers/prescriptionController.js';
import authDoctor from '../middlewares/authDoctor.js';

const prescriptionRouter = express.Router();

// Doctor endpoints for prescription management
prescriptionRouter.post('/add-prescription', authDoctor, addPrescription);
prescriptionRouter.post('/get-doctor-prescription', authDoctor, getDoctorPrescriptions);
prescriptionRouter.get('/doctor-prescriptions', authDoctor, getDoctorPrescriptions);

export default prescriptionRouter;
