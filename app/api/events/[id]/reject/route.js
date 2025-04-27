import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Reject an event
export async function POST(request, { params }) {
  try {
    const { id } = params;
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
        { error: "Not authorized to reject events" },
        { status: 403 }
      );
    }

    const { reason } = await request.json();

    // Update the event status
    const event = await prisma.event.update({
      where: { id },
      data: {
        status: "rejected",
        approvedBy: userId,
        approvedAt: new Date(),
        rejectionReason: reason || "No reason provided",
      },
    });

    // TODO: Could send a notification to the event organizer here

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error rejecting event:", error);
    return NextResponse.json(
      { error: "Failed to reject event" },
      { status: 500 }
    );
  }
}
