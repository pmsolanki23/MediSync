import express from 'express';
import { addReview, getDoctorReviews, getUserReviews, markHelpful } from '../controllers/reviewController.js';
import authUser from '../middlewares/authUser.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.get('/doctor/:docId', getDoctorReviews);
reviewRouter.get('/user', authUser, getUserReviews);
reviewRouter.post('/helpful', markHelpful);

export default reviewRouter;
