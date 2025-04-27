import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Approve an event
export async function POST(request, { params }) {
  try {
    const { id } = params;

    // Use getAuth instead of auth
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an admin or approver
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== "admin" && user?.role !== "approver") {
      return NextResponse.json(
        { error: "Not authorized to approve events" },
        { status: 403 }
      );
    }

    // Update the event status
    const event = await prisma.event.update({
      where: { id },
      data: {
        status: "approved",
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });

    // TODO: Could send a notification to the event organizer here

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error approving event:", error);
    return NextResponse.json(
      { error: "Failed to approve event: " + error.message },
      { status: 500 }
    );
  }
}
