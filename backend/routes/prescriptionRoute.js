import express from 'express';
import { addPrescription, getUserPrescriptions, getPrescription } from '../controllers/prescriptionController.js';
import authUser from '../middlewares/authUser.js';
import authDoctor from '../middlewares/authDoctor.js';

const prescriptionRouter = express.Router();

prescriptionRouter.post('/add', authDoctor, addPrescription);
prescriptionRouter.get('/user-prescriptions', authUser, getUserPrescriptions);
prescriptionRouter.get('/:prescriptionId', authUser, getPrescription);

export default prescriptionRouter;
