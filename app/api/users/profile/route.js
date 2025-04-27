// app/api/users/profile/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Get user profile
export async function GET(request) {
  try {
    console.log("GET request to /api/users/profile");

    // Use getAuth instead of auth for this Clerk version
    const auth = getAuth(request);
    const userId = auth.userId;
    console.log("Auth userId:", userId);

    if (!userId) {
      console.log("No userId found in auth");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile: " + error.message },
      { status: 500 }
    );
  }
}

// Create or update user profile
export async function POST(request) {
  try {
    console.log("POST request to /api/users/profile");

    const auth = getAuth(request);
    const userId = auth.userId;
    console.log("Auth userId:", userId);

    if (!userId) {
      console.log("No userId found in auth");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Request body:", body);

    const { name, email, bio, role, userType } = body;

    // Input validation
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("Creating/updating user with data:", {
      id: userId,
      name,
      email,
      bio: bio || "",
      role: role || "user",
      userType: userType || "",
    });

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        name,
        email,
        bio: bio || "",
        role: role || "user",
        userType: userType || "",
      },
      create: {
        id: userId,
        name,
        email,
        bio: bio || "",
        role: "user",
        userType: userType || "",
      },
    });

    console.log("User created/updated successfully:", user);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile: " + error.message },
      { status: 500 }
    );
  }
}
