import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Add or remove like for a review
export async function POST(request, { params }) {
  try {
    const { id } = params; // review id

    // Get authenticated user
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the user has already liked this review
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        reviewId_userId: {
          reviewId: id,
          userId,
        },
      },
    });

    let result;

    if (existingLike) {
      // User has already liked this review, so remove the like (unlike)
      await prisma.reviewLike.delete({
        where: {
          reviewId_userId: {
            reviewId: id,
            userId,
          },
        },
      });

      result = {
        action: "unliked",
        message: "Like removed successfully",
      };
    } else {
      // User hasn't liked this review yet, so add a like
      await prisma.reviewLike.create({
        data: {
          review: {
            connect: { id },
          },
          user: {
            connect: { id: userId },
          },
        },
      });

      result = {
        action: "liked",
        message: "Review liked successfully",
      };
    }

    // Get updated like count
    const updatedLikesCount = await prisma.reviewLike.count({
      where: { reviewId: id },
    });

    return NextResponse.json({
      ...result,
      likesCount: updatedLikesCount,
    });
  } catch (error) {
    console.error("Error processing review like:", error);
    return NextResponse.json(
      { error: "Failed to process like: " + error.message },
      { status: 500 }
    );
  }
}
