import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Get events with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const searchTerm = searchParams.get("search");
    const date = searchParams.get("date");
    const location = searchParams.get("location");
    const status = searchParams.get("status") || "approved"; // Default to approved events
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : undefined;

    // Build the where clause for filtering
    const where = {
      status,
      ...(category && category !== "all" ? { category } : {}),
      ...(date ? { date: new Date(date) } : {}),
      ...(searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(location
        ? { location: { contains: location, mode: "insensitive" } }
        : {}),
    };

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      ...(limit ? { take: limit } : {}),
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events: " + error.message },
      { status: 500 }
    );
  }
}

// Create a new event
export async function POST(request) {
  try {
    console.log("POST request to /api/events");

    // Get authentication
    const auth = getAuth(request);
    const userId = auth.userId;
    console.log("Auth userId:", userId);

    if (!userId) {
      console.log("No userId found in auth");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.log("User not found in database");
      return NextResponse.json(
        { error: "User profile not found. Please complete onboarding first." },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);

    const { title, description, date, time, location, category } = body;

    // Validate required fields
    if (!title || !description || !date || !time || !location || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Create the event
      const event = await prisma.event.create({
        data: {
          title,
          description,
          date: new Date(date),
          time,
          location,
          category,
          organizer: {
            connect: { id: userId },
          },
        },
      });

      console.log("Event created successfully:", event);
      return NextResponse.json(event);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        {
          error: "Database error: " + dbError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event: " + error.message },
      { status: 500 }
    );
  }
}
