"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoleSelection from "../../components/RoleSelection";

export default function OnboardingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    // If user is not signed in, redirect to home page
    if (!isSignedIn) {
      router.push("/");
      return;
    }

    // Check if user already has a role
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      // User already has completed onboarding, redirect to home
      setIsRedirecting(true);
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isRedirecting) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      <RoleSelection />
    </div>
  );
}
