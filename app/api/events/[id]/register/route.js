import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Register for an event
export async function POST(request, { params }) {
  try {
    const { id } = params;

    // Get authenticated user
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the event exists and is approved
    const event = await prisma.event.findUnique({
      where: {
        id,
        status: "approved",
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found or not approved" },
        { status: 404 }
      );
    }

    // Add the user to the event's attendees
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        attendees: {
          connect: { id: userId },
        },
      },
      include: {
        attendees: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully registered for event",
      attendees: updatedEvent.attendees,
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: "Failed to register for event: " + error.message },
      { status: 500 }
    );
  }
}

// Unregister from an event
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Get authenticated user
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove the user from the event's attendees
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        attendees: {
          disconnect: { id: userId },
        },
      },
      include: {
        attendees: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully unregistered from event",
      attendees: updatedEvent.attendees,
    });
  } catch (error) {
    console.error("Error unregistering from event:", error);
    return NextResponse.json(
      { error: "Failed to unregister from event: " + error.message },
      { status: 500 }
    );
  }
}
