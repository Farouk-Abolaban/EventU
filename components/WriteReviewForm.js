"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

export default function WriteReviewForm({
  eventId,
  initialData = { rating: 0, content: "" },
  onReviewSubmitted,
  onCancel,
}) {
  const [rating, setRating] = useState(initialData.rating);
  const [content, setContent] = useState(initialData.content);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = initialData.rating > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter review content");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/events/${eventId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const newReview = await response.json();

      // Call the callback with the new review data
      onReviewSubmitted(newReview);

      // Reset form if not editing
      if (!isEditing) {
        setRating(0);
        setContent("");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredRating) => {
    setHoveredRating(hoveredRating);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        {isEditing ? "Edit your review" : "Write a review"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div
            className="flex space-x-1"
            onMouseLeave={() => setHoveredRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  } cursor-pointer transition-colors duration-100`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-gray-700">{rating} / 5</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="review-content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Review
          </label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience with this event..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              disabled={submitting}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:bg-red-400"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : isEditing
              ? "Update Review"
              : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
