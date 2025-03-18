"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      alert("Please select a role to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      // Store the selected role in localStorage for now
      // In a production app, you'd store this in your database
      const userData = {
        userId: user.id,
        role: selectedRole,
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("userProfile", JSON.stringify(userData));

      // In a real app, you would make an API call here:
      // await fetch('/api/users/role', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user.id, role: selectedRole })
      // });

      router.push("/");
    } catch (error) {
      console.error("Error saving user role:", error);
      alert("There was an error saving your role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    {
      id: "user",
      title: "Regular User",
      description: "Discover and attend events on campus.",
      icon: "👤",
    },
    {
      id: "approver",
      title: "Event Approver",
      description: "Review and approve events created by users.",
      icon: "✅",
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Manage the platform, users, and all events.",
      icon: "⚙️",
    },
  ];

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
        Select Your Role
      </h1>
      <p className="text-gray-700 mb-6 text-center">
        Choose the role that best describes how you'll use EventU
      </p>

      <div className="space-y-4 mb-8">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedRole === role.id
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-red-300"
            }`}
            onClick={() => handleRoleSelect(role.id)}
          >
            <div className="flex items-center">
              <div className="text-2xl mr-3">{role.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-800">{role.title}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedRole}
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition ${
          isSubmitting || !selectedRole
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {isSubmitting ? "Setting up your account..." : "Continue"}
      </button>
    </div>
  );
}
