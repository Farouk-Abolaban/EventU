"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Trash2,
  Edit,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import ReviewComments from "./ReviewComments";
import WriteReviewForm from "./WriteReviewForm";

export default function EventReviews({ eventId, eventStatus, isAttendee }) {
  const { isSignedIn, user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}/reviews`);

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data);

      // Check if the current user has already reviewed this event
      if (isSignedIn && user) {
        const hasReviewed = data.some((review) => review.userId === user.id);
        setUserHasReviewed(hasReviewed);
      }

      // Calculate average rating
      if (data.length > 0) {
        const totalRating = data.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAverageRating((totalRating / data.length).toFixed(1));
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewReview = (newReview) => {
    setReviews([newReview, ...reviews]);
    setUserHasReviewed(true);

    // Recalculate average rating
    const totalRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) +
      newReview.rating;
    setAverageRating((totalRating / (reviews.length + 1)).toFixed(1));

    toast.success("Review submitted successfully!");
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      const updatedReview = await response.json();

      // Update the reviews state
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? updatedReview : review
        )
      );

      // Recalculate average rating
      const totalRating = reviews.reduce(
        (sum, review) =>
          review.id === reviewId
            ? sum + updatedReview.rating
            : sum + review.rating,
        0
      );
      setAverageRating((totalRating / reviews.length).toFixed(1));

      setEditingReview(null);
      toast.success("Review updated successfully!");
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Failed to update review. Please try again.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      // Remove the review from the state
      const updatedReviews = reviews.filter((review) => review.id !== reviewId);
      setReviews(updatedReviews);

      // Recalculate average rating
      if (updatedReviews.length > 0) {
        const totalRating = updatedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAverageRating((totalRating / updatedReviews.length).toFixed(1));
      } else {
        setAverageRating(0);
      }

      // Reset user has reviewed if they deleted their review
      if (isSignedIn && user) {
        const hasReviewed = updatedReviews.some(
          (review) => review.userId === user.id
        );
        setUserHasReviewed(hasReviewed);
      }

      toast.success("Review deleted successfully!");
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!isSignedIn) {
      toast.error("Please sign in to like reviews");
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to process like");
      }

      const result = await response.json();

      // Update the reviews state with the new like status
      setReviews(
        reviews.map((review) => {
          if (review.id === reviewId) {
            return {
              ...review,
              userHasLiked: !review.userHasLiked,
              _count: {
                ...review._count,
                likes: result.likesCount,
              },
            };
          }
          return review;
        })
      );

      toast.success(
        result.action === "liked" ? "Review liked!" : "Review unliked"
      );
    } catch (err) {
      console.error("Error liking review:", err);
      toast.error("Failed to process like. Please try again.");
    }
  };

  const toggleComments = (reviewId) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null);
    } else {
      setExpandedReview(reviewId);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          size={16}
          className={`${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h2>
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h2>
        <div className="bg-red-50 p-4 rounded-md text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center">
            <div className="flex mr-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-gray-700 font-medium">
              {averageRating} / 5
            </span>
            <span className="text-gray-500 ml-2">
              ({reviews.length} reviews)
            </span>
          </div>
        )}
      </div>

      {eventStatus === "approved" &&
        isSignedIn &&
        isAttendee &&
        !userHasReviewed && (
          <WriteReviewForm
            eventId={eventId}
            onReviewSubmitted={handleNewReview}
          />
        )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {eventStatus === "approved"
            ? "No reviews yet. Be the first to review this event!"
            : "No reviews available for this event."}
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`border rounded-lg p-4 ${
                editingReview === review.id
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">
                      {review.user.name || "Anonymous User"}
                    </span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {isSignedIn &&
                  user &&
                  user.id === review.userId &&
                  !editingReview && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingReview(review.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit review"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
              </div>

              {editingReview === review.id ? (
                <WriteReviewForm
                  eventId={eventId}
                  initialData={{
                    rating: review.rating,
                    content: review.content,
                  }}
                  onReviewSubmitted={(updatedData) =>
                    handleUpdateReview(review.id, updatedData)
                  }
                  onCancel={() => setEditingReview(null)}
                />
              ) : (
                <>
                  <p className="text-gray-700 my-3 whitespace-pre-line">
                    {review.content}
                  </p>

                  <div className="flex items-center mt-4 space-x-6">
                    <button
                      onClick={() => handleLikeReview(review.id)}
                      className={`flex items-center space-x-1 text-sm ${
                        review.userHasLiked
                          ? "text-blue-600 font-medium"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      <ThumbsUp
                        size={14}
                        className={review.userHasLiked ? "fill-blue-600" : ""}
                      />
                      <span>{review._count.likes || 0} Likes</span>
                    </button>

                    <button
                      onClick={() => toggleComments(review.id)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
                    >
                      <MessageSquare size={14} />
                      <span>{review._count.comments || 0} Comments</span>
                    </button>
                  </div>

                  {expandedReview === review.id && (
                    <ReviewComments
                      reviewId={review.id}
                      onCommentAdded={() => {
                        // Update comment count in the UI
                        setReviews(
                          reviews.map((r) => {
                            if (r.id === review.id) {
                              return {
                                ...r,
                                _count: {
                                  ...r._count,
                                  comments: (r._count.comments || 0) + 1,
                                },
                              };
                            }
                            return r;
                          })
                        );
                      }}
                      onCommentDeleted={() => {
                        // Update comment count in the UI
                        setReviews(
                          reviews.map((r) => {
                            if (r.id === review.id && r._count.comments > 0) {
                              return {
                                ...r,
                                _count: {
                                  ...r._count,
                                  comments: r._count.comments - 1,
                                },
                              };
                            }
                            return r;
                          })
                        );
                      }}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
