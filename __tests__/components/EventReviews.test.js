import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import EventReviews from "@/components/EventReviews";

// Mock dependencies
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock child components
jest.mock("@/components/WriteReviewForm", () => {
  return function MockWriteReviewForm({ onReviewSubmitted }) {
    return (
      <div data-testid="write-review-form">
        <button
          data-testid="submit-review-button"
          onClick={() =>
            onReviewSubmitted({
              id: "new-review-id",
              rating: 5,
              content: "Great event!",
              userId: "user-123",
              user: { id: "user-123", name: "Test User" },
              _count: { likes: 0, comments: 0 },
              userHasLiked: false,
            })
          }
        >
          Submit Review
        </button>
      </div>
    );
  };
});

jest.mock("@/components/ReviewComments", () => {
  return function MockReviewComments({
    reviewId,
    onCommentAdded,
    onCommentDeleted,
  }) {
    return (
      <div data-testid={`review-comments-${reviewId}`}>
        <button data-testid="add-comment-button" onClick={onCommentAdded}>
          Add Comment
        </button>
        <button data-testid="delete-comment-button" onClick={onCommentDeleted}>
          Delete Comment
        </button>
      </div>
    );
  };
});

// Mock fetch
global.fetch = jest.fn();

describe("EventReviews Component", () => {
  const mockEventId = "event-123";
  const mockReviews = [
    {
      id: "review-1",
      rating: 5,
      content: "Excellent event!",
      createdAt: "2023-01-01T00:00:00Z",
      userId: "user-1",
      user: { id: "user-1", name: "John Doe" },
      _count: { likes: 2, comments: 1 },
      userHasLiked: true,
    },
    {
      id: "review-2",
      rating: 3,
      content: "It was okay.",
      createdAt: "2023-01-02T00:00:00Z",
      userId: "user-2",
      user: { id: "user-2", name: "Jane Smith" },
      _count: { likes: 0, comments: 0 },
      userHasLiked: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock default fetch implementation
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockReviews,
    });

    // Mock default useUser implementation
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "user-123", fullName: "Test User" },
    });
  });

  test("renders loading state initially", async () => {
    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    expect(screen.getByText("Reviews")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument(); // spinner

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/events/${mockEventId}/reviews`
      );
    });
  });

  test("renders reviews after loading", async () => {
    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument(); // spinner should be gone
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Excellent event!")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("It was okay.")).toBeInTheDocument();
    });
  });

  test("displays average rating correctly", async () => {
    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      // Average of 5 and 3 is 4
      expect(screen.getByText("4.0 / 5")).toBeInTheDocument();
      expect(screen.getByText("(2 reviews)")).toBeInTheDocument();
    });
  });

  test("shows write review form if user is signed in, is attendee, and has not reviewed", async () => {
    // Mock that user is signed in, is attendee, and hasn't reviewed
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "different-user", fullName: "Test User" },
    });

    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("write-review-form")).toBeInTheDocument();
    });
  });

  test("does not show write review form if user already reviewed", async () => {
    // Mock that user is signed in, is attendee, but has already reviewed
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "user-1", fullName: "John Doe" },
    });

    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      expect(screen.queryByTestId("write-review-form")).not.toBeInTheDocument();
    });
  });

  test("does not show write review form if event is not approved", async () => {
    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="pending"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      expect(screen.queryByTestId("write-review-form")).not.toBeInTheDocument();
    });
  });

  test("does not show write review form if user is not an attendee", async () => {
    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={false}
      />
    );

    await waitFor(() => {
      expect(screen.queryByTestId("write-review-form")).not.toBeInTheDocument();
    });
  });

  test("handles review submission correctly", async () => {
    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("write-review-form")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("submit-review-button"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Review submitted successfully!"
      );
      // Should now show 3 reviews (2 mock + 1 new)
      expect(screen.getByText("(3 reviews)")).toBeInTheDocument();
    });
  });

  test("shows edit/delete buttons for user's own reviews", async () => {
    // Mock that user is viewing their own review
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "user-1", fullName: "John Doe" },
    });

    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      const editButtons = screen.getAllByTitle("Edit review");
      const deleteButtons = screen.getAllByTitle("Delete review");

      // Should find one edit and one delete button (for the user's own review)
      expect(editButtons.length).toBe(1);
      expect(deleteButtons.length).toBe(1);
    });
  });

  test("does not show edit/delete buttons for other users' reviews", async () => {
    // Mock that user is not the author of any review
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "different-user", fullName: "Different User" },
    });

    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      expect(screen.queryByTitle("Edit review")).not.toBeInTheDocument();
      expect(screen.queryByTitle("Delete review")).not.toBeInTheDocument();
    });
  });

  test("handles like/unlike functionality", async () => {
    // Mock fetch for like action
    global.fetch.mockImplementation(async (url) => {
      if (url.includes("/like")) {
        return {
          ok: true,
          json: async () => ({
            action: "liked",
            message: "Review liked successfully",
            likesCount: 3,
          }),
        };
      }
      return {
        ok: true,
        json: async () => mockReviews,
      };
    });

    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      // Find like button for the second review (which user hasn't liked yet)
      const likeButtons = screen.getAllByText(/Likes/);
      expect(likeButtons[1]).toHaveTextContent("0 Likes");

      fireEvent.click(likeButtons[1]);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/like"),
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith("Review liked!");
    });
  });

  test("handles review deletion", async () => {
    // Mock user is author of a review
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "user-1", fullName: "John Doe" },
    });

    // Mock fetch for delete action
    global.fetch.mockImplementation(async (url, options) => {
      if (options && options.method === "DELETE") {
        return {
          ok: true,
          json: async () => ({ message: "Review deleted successfully" }),
        };
      }
      return {
        ok: true,
        json: async () => mockReviews,
      };
    });

    // Mock window.confirm
    window.confirm = jest.fn().mockImplementation(() => true);

    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      const deleteButton = screen.getByTitle("Delete review");
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/reviews/"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Review deleted successfully!"
      );
    });
  });

  test("shows comments when toggle is clicked", async () => {
    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      const commentButtons = screen.getAllByText(/Comments/);
      fireEvent.click(commentButtons[0]);

      // Should show comments for the first review
      expect(
        screen.getByTestId("review-comments-review-1")
      ).toBeInTheDocument();
    });
  });

  test("updates comment count when comment is added", async () => {
    render(
      <EventReviews
        eventId={mockEventId}
        eventStatus="approved"
        isAttendee={true}
      />
    );

    await waitFor(() => {
      const commentButtons = screen.getAllByText(/Comments/);
      fireEvent.click(commentButtons[0]);
    });

    // Find and click the add comment button inside the ReviewComments component
    const addCommentButton = screen.getByTestId("add-comment-button");
    fireEvent.click(addCommentButton);

    await waitFor(() => {
      // Comment count should increment
      const commentButton = screen.getAllByText(/Comments/)[0];
      expect(commentButton).toHaveTextContent("2 Comments");
    });
  });
});
