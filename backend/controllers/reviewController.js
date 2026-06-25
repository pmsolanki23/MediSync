import reviewModel from "../models/reviewModel.js";
import appointmentModel from "../models/appointmentModel.js";

const addReview = async (req, res) => {
  try {
    const { docId, appointmentId, rating, title, comment } = req.body;
    const { userId } = req.headers;

    if (!rating || !title || !comment) {
      return res.json({ success: false, message: "All fields required" });
    }

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating must be 1-5" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.userId !== userId) {
      return res.json({ success: false, message: "Invalid appointment" });
    }

    if (!appointment.isCompleted) {
      return res.json({ success: false, message: "Can only review completed appointments" });
    }

    const existingReview = await reviewModel.findOne({ appointmentId });
    if (existingReview) {
      return res.json({ success: false, message: "Already reviewed this appointment" });
    }

    const review = new reviewModel({
      docId,
      userId,
      userName: appointment.userData.name,
      userImage: appointment.userData.image,
      rating,
      title,
      comment,
      appointmentId,
      date: Date.now()
    });

    await review.save();
    res.json({ success: true, message: "Review added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getDoctorReviews = async (req, res) => {
  try {
    const { docId } = req.params;

    const reviews = await reviewModel
      .find({ docId })
      .sort({ date: -1 })
      .limit(10);

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ success: true, reviews, avgRating, totalReviews: reviews.length });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.headers;

    const reviews = await reviewModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.body;

    const review = await reviewModel.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    res.json({ success: true, review });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addReview, getDoctorReviews, getUserReviews, markHelpful };
