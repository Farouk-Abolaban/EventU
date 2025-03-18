"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AuthRedirector() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait for Clerk to load user data
    if (!isLoaded) return;

    if (isSignedIn) {
      // Check if the user already has a role
      const userProfile = localStorage.getItem("userProfile");

      if (userProfile) {
        // User has a profile, redirect to home
        router.push("/");
      } else {
        // New user, redirect to onboarding
        router.push("/onboarding");
      }
    }
  }, [isLoaded, isSignedIn, router, user]);

  return null; // This component doesn't render anything
}
