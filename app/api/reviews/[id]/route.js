import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Get a specific review
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // If the user is authenticated, check if they've liked this review
    const auth = getAuth(request);
    const userId = auth.userId;

    let reviewWithLikeStatus = review;

    if (userId) {
      const userLike = await prisma.reviewLike.findUnique({
        where: {
          reviewId_userId: {
            reviewId: id,
            userId,
          },
        },
      });

      reviewWithLikeStatus = {
        ...review,
        userHasLiked: Boolean(userLike),
      };
    }

    return NextResponse.json(reviewWithLikeStatus);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review: " + error.message },
      { status: 500 }
    );
  }
}

// Update a review
export async function PATCH(request, { params }) {
  try {
    const { id } = params;

    // Get authenticated user
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the review exists and belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (existingReview.userId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to update this review" },
        { status: 403 }
      );
    }

    // Parse request body
    const { rating, content } = await request.json();

    // Validate inputs
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(content && { content }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Check if the user has liked this review
    const userLike = await prisma.reviewLike.findUnique({
      where: {
        reviewId_userId: {
          reviewId: id,
          userId,
        },
      },
    });

    const reviewWithLikeStatus = {
      ...updatedReview,
      userHasLiked: Boolean(userLike),
    };

    return NextResponse.json(reviewWithLikeStatus);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review: " + error.message },
      { status: 500 }
    );
  }
}

// Delete a review
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Get authenticated user
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the review to check if the user is the author or an admin
    const review = await prisma.review.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user is the author or an admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (review.userId !== userId && user?.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to delete this review" },
        { status: 403 }
      );
    }

    // Delete the review (will cascade delete comments and likes)
    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review: " + error.message },
      { status: 500 }
    );
  }
}
