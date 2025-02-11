import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "sonner";

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
    <ClerkProvider>
      <body>
        <html lang="en">
          <body>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            {children}
          </body>
        </html>
        {/* Footer */}
        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Made by Farouk, Husam, Franklyn, Jeremy</p>
          </div>
        </footer>
      </body>
    </ClerkProvider>
  );
}
