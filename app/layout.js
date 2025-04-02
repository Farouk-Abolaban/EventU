import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Toaster } from "sonner";
import CustomUserDropdown from "@/app/CustomUserDropdown"; //user icon dropdown
import RoleSwitcher from "@/components/RoleSwitcher"; // import the RoleSwitcher component
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EventU",
  description: "University Event Management System",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      // Add redirectUrl for both signIn and signUp
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/onboarding"
      afterSignUpUrl="/onboarding"
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 flex flex-col min-h-screen`}
          suppressHydrationWarning={true}
        >
          <Toaster /> {/* Ensures notifications work */}
          {/* Navigation */}
          <nav className="p-4 bg-white shadow-md flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-red-600">MSU</h1>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-red-600 transition"
              >
                Home
              </Link>
              <Link
                href="/explore-events"
                className="text-gray-700 hover:text-red-600 transition"
              >
                Events
              </Link>
              <Link
                href="/calendar"
                className="text-gray-700 hover:text-red-600 transition"
              >
                Calendar
              </Link>
              <Link
                href="/about-us"
                className="text-gray-700 hover:text-red-600 transition"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-red-600 transition"
              >
                Contact
              </Link>
            </div>

            <div>
              <SignedOut>
                <div className="flex space-x-2">
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 border border-red-600 text-red-600 font-medium rounded-md hover:bg-red-50 transition">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center">
                  <RoleSwitcher /> {/* Add the RoleSwitcher component here */}
                  <CustomUserDropdown />
                </div>
              </SignedIn>
            </div>
          </nav>
          {/* Page Content */}
          <main className="flex-grow py-6 px-4">{children}</main>
          {/* Footer */}
          <footer className="bg-red-50 py-6 text-center text-gray-600 mt-auto">
            <p>Made by Farouk, Husam, Franklyn, Jeremy</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
