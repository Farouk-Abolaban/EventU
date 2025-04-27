import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Get a specific event
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event: " + error.message },
      { status: 500 }
    );
  }
}

// Update an event
export async function PATCH(request, { params }) {
  try {
    const { id } = params;

    // Get authenticated user
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the event to check if the user is the organizer
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      select: { organizerId: true, status: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user is the organizer or an admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isAdmin = user?.role === "admin";
    const isOrganizer = existingEvent.organizerId === userId;

    if (!isAdmin && !isOrganizer) {
      return NextResponse.json(
        { error: "Not authorized to update this event" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // If the event is already approved, only admins can update status
    if (
      existingEvent.status === "approved" &&
      body.status &&
      body.status !== "approved" &&
      !isAdmin
    ) {
      return NextResponse.json(
        { error: "Cannot change status of an approved event" },
        { status: 403 }
      );
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...body,
        // If date is provided, convert it to a Date object
        ...(body.date ? { date: new Date(body.date) } : {}),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event: " + error.message },
      { status: 500 }
    );
  }
}

// Delete an event
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Get authenticated user
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the event to check if the user is the organizer
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      select: { organizerId: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user is the organizer or an admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (existingEvent.organizerId !== userId && user?.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to delete this event" },
        { status: 403 }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event: " + error.message },
      { status: 500 }
    );
  }
}
