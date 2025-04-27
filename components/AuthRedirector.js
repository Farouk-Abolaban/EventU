"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AuthRedirector() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Check if the user object has loaded
    if (!isLoaded) return;

    // If user is signed in, redirect to home
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, isLoaded, router]);

  return null; // This component doesn't render anything
}
