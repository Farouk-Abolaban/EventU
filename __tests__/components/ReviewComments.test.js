import React from "react";
import { render, screen } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";
import ReviewComments from "@/components/ReviewComments";

// Mock the dependencies used in the component
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Simple mock for Lucide React icons
jest.mock("lucide-react", () => ({
  Send: () => <span data-testid="send-icon">→</span>,
  Edit: () => <span data-testid="edit-icon">✎</span>,
  Trash2: () => <span data-testid="trash-icon">🗑</span>,
}));

describe("ReviewComments Component - Basic Rendering", () => {
  // Mock props
  const mockProps = {
    reviewId: "test-review-id",
    onCommentAdded: jest.fn(),
    onCommentDeleted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup fetch mock
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "comment-1",
              content: "Great review!",
              createdAt: "2023-01-01T12:00:00Z",
              userId: "user-1",
              user: { id: "user-1", name: "John Doe" },
            },
            {
              id: "comment-2",
              content: "I disagree with this review.",
              createdAt: "2023-01-02T12:00:00Z",
              userId: "user-2",
              user: { id: "user-2", name: "Jane Smith" },
            },
          ]),
      })
    );

    // Default mock for useUser
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "test-user-id", fullName: "Test User" },
    });
  });

  test("renders the comments heading", async () => {
    render(<ReviewComments {...mockProps} />);

    // Check that the heading is rendered
    expect(screen.getByText("Comments")).toBeInTheDocument();
  });

  test("renders a message for signed-out users", async () => {
    // Mock user not signed in
    useUser.mockReturnValue({
      isSignedIn: false,
      user: null,
    });

    render(<ReviewComments {...mockProps} />);

    // Wait for the component to load comments
    await screen.findByText("Comments");

    // Check that the signed-out message is rendered
    expect(
      screen.getByText("Please sign in to add a comment")
    ).toBeInTheDocument();
  });

  test("renders comment form for signed-in users", async () => {
    render(<ReviewComments {...mockProps} />);

    // Wait for the component to load comments
    await screen.findByText("Comments");

    // Check that the comment form is rendered
    expect(screen.getByPlaceholderText("Add a comment...")).toBeInTheDocument();
    expect(screen.getByTestId("send-icon")).toBeInTheDocument();
  });
});
