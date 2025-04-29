import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Get all reviews for an event
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get reviews with user information and aggregated like count
    const reviews = await prisma.review.findMany({
      where: { eventId: id },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // If the user is authenticated, check which reviews they've liked
    const auth = getAuth(request);
    const userId = auth.userId;

    let reviewsWithLikeStatus = reviews;

    if (userId) {
      // Get all likes by the current user for these reviews
      const userLikes = await prisma.reviewLike.findMany({
        where: {
          userId,
          reviewId: {
            in: reviews.map((review) => review.id),
          },
        },
        select: {
          reviewId: true,
        },
      });

      // Create a set of reviewIds that the user has liked for faster lookup
      const likedReviewIds = new Set(userLikes.map((like) => like.reviewId));

      // Add the userHasLiked flag to each review
      reviewsWithLikeStatus = reviews.map((review) => ({
        ...review,
        userHasLiked: likedReviewIds.has(review.id),
      }));
    }

    return NextResponse.json(reviewsWithLikeStatus);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews: " + error.message },
      { status: 500 }
    );
  }
}

// Create a new review for an event
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { rating, content } = await request.json();

    // Validate inputs
    if (!rating || !content) {
      return NextResponse.json(
        { error: "Rating and content are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user has already reviewed this event
    const existingReview = await prisma.review.findFirst({
      where: {
        eventId: id,
        userId: userId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this event" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        content,
        event: {
          connect: { id },
        },
        user: {
          connect: { id: userId },
        },
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

    // Add userHasLiked property (will be false for a new review)
    const reviewWithLikeStatus = {
      ...review,
      userHasLiked: false,
    };

    return NextResponse.json(reviewWithLikeStatus);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review: " + error.message },
      { status: 500 }
    );
  }
}
