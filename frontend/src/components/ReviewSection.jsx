import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContextObject'

const ReviewSection = ({ docId, appointmentId, onReviewAdded }) => {
  const { token, backendUrl } = useContext(AppContext)
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [docId])

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/review/doctor/${docId}`)
      if (data.success) {
        setReviews(data.reviews)
        setAvgRating(data.avgRating)
      }
    } catch (error) {
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.comment.trim()) {
      toast.warning('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/review/add`,
        { docId, appointmentId, ...formData },
        { headers: { token } }
      )

      if (data.success) {
        toast.success('Review added successfully')
        setFormData({ rating: 5, title: '', comment: '' })
        setShowReviewForm(false)
        fetchReviews()
        onReviewAdded?.()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkHelpful = async (reviewId) => {
    try {
      await axios.post(`${backendUrl}/api/review/helpful`, { reviewId })
      fetchReviews()
    } catch (error) {
    }
  }

  return (
    <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8'>
        <div className='flex-1'>
          <h3 className='text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900'>Patient Reviews</h3>
          <div className='mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-3'>
            <div className='flex items-center gap-1'>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg sm:text-xl ${i < Math.floor(avgRating) ? 'text-yellow-400' : 'text-slate-300'}`}>★</span>
              ))}
            </div>
            <span className='text-base sm:text-lg font-bold text-slate-800'>{avgRating}</span>
            <span className='text-xs sm:text-sm text-slate-500'>({reviews.length} reviews)</span>
          </div>
        </div>
        {appointmentId && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className='rounded-xl sm:rounded-2xl border border-primary bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary transition hover:bg-primary hover:text-white whitespace-nowrap'
          >
            Write Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmit} className='mb-6 rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6 lg:p-8'>
          <h4 className='mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-slate-900'>Share your experience</h4>

          {/* Rating */}
          <div className='mb-5 sm:mb-6'>
            <label className='mb-2 sm:mb-3 block text-xs sm:text-sm font-medium text-slate-700'>Rating</label>
            <div className='flex gap-1.5 sm:gap-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className='text-2xl sm:text-3xl transition touch-target'
                >
                  <span className={formData.rating >= star ? 'text-yellow-400' : 'text-slate-300'}>★</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className='mb-5 sm:mb-6'>
            <label className='mb-2 sm:mb-3 block text-xs sm:text-sm font-medium text-slate-700'>Review Title</label>
            <input
              type='text'
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder='e.g., Excellent doctor, very helpful'
              className='w-full rounded-xl sm:rounded-2xl border border-slate-200 px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm outline-none focus:border-primary transition'
              maxLength={100}
            />
            <p className='mt-1 text-xs text-slate-400'>{formData.title.length}/100</p>
          </div>

          {/* Comment */}
          <div className='mb-5 sm:mb-6'>
            <label className='mb-2 sm:mb-3 block text-xs sm:text-sm font-medium text-slate-700'>Your Review</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder='Share your experience with this doctor...'
              className='w-full rounded-xl sm:rounded-2xl border border-slate-200 px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm outline-none focus:border-primary transition'
              rows={4}
              maxLength={500}
            />
            <p className='mt-1 text-xs text-slate-400'>{formData.comment.length}/500</p>
          </div>

          {/* Buttons */}
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            <button
              type='submit'
              disabled={loading}
              className='rounded-xl sm:rounded-2xl bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70'
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type='button'
              onClick={() => setShowReviewForm(false)}
              className='rounded-xl sm:rounded-2xl border border-slate-200 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className='space-y-3 sm:space-y-4'>
        {reviews.length === 0 ? (
          <p className='text-center py-8 text-sm text-slate-500'>No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className='rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4 lg:p-5'>
              <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4'>
                <div className='flex-1 min-w-0'>
                  {/* Header */}
                  <div className='flex items-start gap-2 sm:gap-3'>
                    {review.userImage && (
                      <img src={review.userImage} alt={review.userName} className='h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0' />
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-slate-900 text-sm sm:text-base'>{review.userName}</p>
                      <div className='flex flex-wrap items-center gap-2 mt-1'>
                        <div className='flex gap-0.5'>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs sm:text-sm ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`}>★</span>
                          ))}
                        </div>
                        <span className='text-xs text-slate-500'>
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className='mt-2 sm:mt-3 font-semibold text-slate-900 text-sm sm:text-base'>{review.title}</p>
                  <p className='mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed'>{review.comment}</p>
                </div>
              </div>

              {/* Helpful */}
              <button
                onClick={() => handleMarkHelpful(review._id)}
                className='mt-2 sm:mt-3 text-xs text-slate-500 transition hover:text-primary font-medium'
              >
                👍 Helpful ({review.helpful})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewSection
