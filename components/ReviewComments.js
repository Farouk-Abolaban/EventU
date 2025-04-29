"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Send, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ReviewComments({
  reviewId,
  onCommentAdded,
  onCommentDeleted,
}) {
  const { isSignedIn, user } = useUser();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/${reviewId}/comments`);

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      toast.error("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/reviews/${reviewId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add comment");
      }

      const addedComment = await response.json();

      // Add the new comment to the state
      setComments([...comments, addedComment]);
      setNewComment("");

      // Notify parent component
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error(err.message || "Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update comment");
      }

      const updatedComment = await response.json();

      // Update the comment in the state
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      );

      setEditingComment(null);
      setEditText("");

      toast.success("Comment updated successfully");
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error(err.message || "Failed to update comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete comment");
      }

      // Remove the comment from the state
      setComments(comments.filter((comment) => comment.id !== commentId));

      // Notify parent component
      if (onCommentDeleted) onCommentDeleted();

      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error(err.message || "Failed to delete comment. Please try again.");
    }
  };

  const startEditingComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.content);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Comments</h4>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between">
                  <div className="font-medium text-sm text-gray-800">
                    {comment.user.name || "Anonymous User"}
                  </div>

                  {isSignedIn && user && user.id === comment.userId && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingComment(comment)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit comment"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete comment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {editingComment === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      rows={2}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {isSignedIn ? (
        <form onSubmit={handleSubmitComment} className="flex items-center mt-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow p-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="p-2 bg-red-600 text-white rounded-r-md hover:bg-red-700 transition disabled:bg-red-400"
          >
            <Send size={16} />
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mt-3">
          Please sign in to add a comment
        </p>
      )}
    </div>
  );
}
