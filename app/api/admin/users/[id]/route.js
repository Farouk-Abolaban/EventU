import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Update a user (admin only)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (adminUser?.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to update user data" },
        { status: 403 }
      );
    }

    const { role } = await request.json();

    // Validate role
    if (!["user", "approver", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
