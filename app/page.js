"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react"; // loading spinner icon from Lucide

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setLoading(true); // Shows loading state animation before redirect
      router.push("/home");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4 animate-fadeIn">Welcome to EventU!</h1>
        <p className="text-lg text-gray-700 mb-6">University Event Management System</p>

        {/* Shows loading spinner to user when redirecting */}
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin h-10 w-10 text-red-600" />
            <p className="mt-2 text-gray-600">Redirecting...</p>
          </div>
        ) : (
          !isSignedIn && isLoaded && (
<SignInButton
  mode="modal"
  afterSignInUrl="/home"
  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 focus:ring focus:ring-red-300"
>

              Sign In
            </SignInButton>
          )
        )}
      </div>
    </div>
  );
}
