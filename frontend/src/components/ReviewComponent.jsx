import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Star, Trash2, Edit } from 'lucide-react'

const ReviewComponent = ({ docId, userId, isDarkMode }) => {
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const backendURL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (docId) {
      fetchReviews()
    }
  }, [docId, page])

  const fetchReviews = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/get-doctor-reviews`,
        { docId, page },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (error) {
    }
  }

  const fetchUserReview = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/get-user-review`,
        { userId, docId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (data.success && data.review) {
        setUserReview(data.review)
        setRating(data.review.rating)
        setComment(data.review.comment)
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    if (userId && docId) {
      fetchUserReview()
    }
  }, [userId, docId])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (comment.trim().length < 5) {
      toast.error('Review must be at least 5 characters')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/add-review`,
        { userId, docId, rating: parseInt(rating), comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      
      if (data.success) {
        toast.success('Review submitted successfully')
        setComment('')
        setRating(5)
        fetchReviews()
        fetchUserReview()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return

    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/delete-review`,
        { userId, reviewId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      
      if (data.success) {
        toast.success('Review deleted')
        fetchReviews()
        fetchUserReview()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-md`}>
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Patient Reviews</h3>

      {/* Write Review Form */}
      {userId && (
        <form onSubmit={handleSubmitReview} className={`mb-6 sm:mb-8 p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
          <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Write Your Review</h4>
          
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none touch-manipulation"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : isDarkMode
                        ? 'text-gray-600'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this doctor..."
              rows={3}
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm touch-manipulation ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3 sm:space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className={`p-3 sm:p-4 border rounded-lg sm:rounded-2xl ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-900'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div className='min-w-0'>
                  <p className="font-semibold text-sm sm:text-base break-words">{review.userName}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : isDarkMode
                            ? 'text-gray-600'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {userId === review.userId && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0 touch-manipulation"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date(review.date).toLocaleDateString()}
              </p>
              <p className="mt-2 sm:mt-3 text-sm break-words">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center py-6 sm:py-8`}>
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  )
}

export default ReviewComponent
