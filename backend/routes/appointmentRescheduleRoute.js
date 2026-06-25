import express from 'express';
import { rescheduleAppointment } from '../controllers/appointmentRescheduleController.js';
import authUser from '../middlewares/authUser.js';

const rescheduleRouter = express.Router();

rescheduleRouter.post('/reschedule', authUser, rescheduleAppointment);

export default rescheduleRouter;
