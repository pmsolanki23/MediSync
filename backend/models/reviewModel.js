import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  docId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userImage: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  appointmentId: { type: String, required: true },
  date: { type: Number, required: true },
  helpful: { type: Number, default: 0 }
}, { timestamps: true });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;
