import React from "react";
import { render, screen } from "@testing-library/react";
import WriteReviewForm from "@/components/WriteReviewForm";

// Mock the dependencies used in the component
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Simple mock for Lucide React icons
jest.mock("lucide-react", () => ({
  Star: () => <span data-testid="star-icon">★</span>,
}));

describe("WriteReviewForm Component - Basic Rendering", () => {
  // Mock props
  const mockProps = {
    eventId: "test-event-id",
    onReviewSubmitted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the form with correct elements", () => {
    render(<WriteReviewForm {...mockProps} />);

    // Check that basic elements are rendered
    expect(screen.getByText("Write a review")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("Your Review")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Share your experience with this event...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit review/i })
    ).toBeInTheDocument();
  });

  test("renders in edit mode with initial data", () => {
    const editProps = {
      ...mockProps,
      initialData: {
        rating: 4,
        content: "This is an existing review",
      },
      onCancel: jest.fn(),
    };

    render(<WriteReviewForm {...editProps} />);

    // Check that edit mode elements are rendered
    expect(screen.getByText("Edit your review")).toBeInTheDocument();
    expect(screen.getByText("4 / 5")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Share your experience with this event...")
    ).toHaveValue("This is an existing review");
    expect(
      screen.getByRole("button", { name: /update review/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });
});
