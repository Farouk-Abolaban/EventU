"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoleSelection from "../../components/RoleSelection";
import { toast } from "sonner";

export default function OnboardingPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    // If user is not signed in, redirect to home page
    if (!isSignedIn) {
      router.push("/");
      return;
    }

    // Check if user already has a profile in the database
    const checkUserProfile = async () => {
      try {
        console.log("Checking if user has profile");

        // No token needed - the Clerk session cookie will be sent automatically
        const response = await fetch("/api/users/profile");

        console.log("Profile check response status:", response.status);

        if (response.ok) {
          // User already has a profile, redirect to home
          console.log("User has existing profile, redirecting");
          setProfileExists(true);
          setIsRedirecting(true);
          router.push("/");
        } else if (response.status === 404) {
          // User doesn't have a profile yet - this is expected
          console.log(
            "User doesn't have a profile yet - showing role selection"
          );
        } else {
          // Some other error
          console.error("Error checking profile:", await response.text());
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
      }
    };

    if (isSignedIn && user) {
      checkUserProfile();
    }
  }, [isLoaded, isSignedIn, router, user]);

  const handleRoleSelection = async (selectedRole) => {
    if (!user) {
      toast.error("User information not available");
      return;
    }

    setIsRedirecting(true);
    try {
      console.log("Selected role:", selectedRole);
      console.log("User data:", {
        fullName: user.fullName,
        email: user.emailAddresses[0]?.emailAddress,
      });

      // Create user profile with the selected role - no token needed
      const response = await fetch("/api/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.fullName || "",
          email: user.emailAddresses[0]?.emailAddress || "",
          role: "user", // All new users get the base role
          bio: "",
          userType: selectedRole, // Store the specific user type
        }),
      });

      console.log("Profile creation response status:", response.status);

      if (response.ok) {
        toast.success("Profile created successfully!");
        router.push("/");
      } else {
        setIsRedirecting(false);
        const errorText = await response.text();
        console.error("Response error:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          toast.error(errorData.error || "Failed to create user profile");
        } catch (e) {
          toast.error("Failed to create user profile");
        }
      }
    } catch (error) {
      setIsRedirecting(false);
      console.error("Error creating user profile:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

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
      <RoleSelection onSelectRole={handleRoleSelection} />
    </div>
  );
}
