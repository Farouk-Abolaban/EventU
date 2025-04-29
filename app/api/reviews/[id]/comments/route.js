import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Get all comments for a review
export async function GET(request, { params }) {
  try {
    const { id } = params; // review id

    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Get comments with user information
    const comments = await prisma.comment.findMany({
      where: { reviewId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Show oldest comments first (chronological order)
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments: " + error.message },
      { status: 500 }
    );
  }
}

// Add a comment to a review
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

    // Parse request body
    const { content } = await request.json();

    // Validate input
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        review: {
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
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment: " + error.message },
      { status: 500 }
    );
  }
}
