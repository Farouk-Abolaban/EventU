"use client";
import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ChevronDown, User, Calendar, Settings, LogOut } from "lucide-react";

export default function CustomUserDropdown() {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { label: "Profile", icon: <User size={16} />, action: () => router.push("/profile") },
    { label: "My Events", icon: <Calendar size={16} />, action: () => router.push("/my-events") },
    { label: "Settings", icon: <Settings size={16} />, action: () => router.push("/settings") },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <img
          src={user?.imageUrl || "/default-avatar.png"}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden sm:inline"></span>
        <ChevronDown size={16} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 border border-gray-200 z-50">
          <p className="px-4 py-2 text-sm font-semibold text-gray-700">{user?.emailAddresses[0]?.emailAddress}</p>
          <hr />

          {/* Dropdown Menu Items */}
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              onClick={item.action}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </button>
          ))}

          <hr />

          {/* Sign Out */}
          <SignOutButton>
            <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition">
              <LogOut size={16} />
              <span className="ml-2">Sign Out</span>
            </button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
}
