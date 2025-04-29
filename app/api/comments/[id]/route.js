import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Update a comment
export async function PATCH(request, { params }) {
  try {
    const { id } = params;

    // Get authenticated user
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the comment exists and belongs to the user
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.userId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to update this comment" },
        { status: 403 }
      );
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

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
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

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment: " + error.message },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Get authenticated user
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the comment to check if the user is the author or an admin
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user is the author or an admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (comment.userId !== userId && user?.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment: " + error.message },
      { status: 500 }
    );
  }
}
