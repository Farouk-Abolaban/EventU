"use client";

import { SignIn } from "@clerk/nextjs";
import AuthRedirector from "../components/AuthRedirector";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthRedirector />
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600">Welcome Back!</h1>
          <p className="mt-2 text-gray-600">Sign in to your EventU account</p>
        </div>
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/onboarding"
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none",
                headerTitle: "text-center text-red-600",
                headerSubtitle: "text-center",
                socialButtonsBlockButton:
                  "border border-gray-300 hover:bg-gray-50",
                formButtonPrimary: "bg-red-600 hover:bg-red-700",
                footerAction: "text-red-600 hover:text-red-700",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
