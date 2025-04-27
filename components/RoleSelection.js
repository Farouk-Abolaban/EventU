"use client";

import { useState } from "react";

export default function RoleSelection({ onSelectRole }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Find and join events on campus",
      icon: "👨‍🎓",
    },
    {
      id: "faculty",
      title: "Faculty/Staff",
      description: "Create and discover university events",
      icon: "👨‍🏫",
    },
    {
      id: "alumni",
      title: "Alumni",
      description: "Stay connected with university events",
      icon: "🎓",
    },
  ];

  const handleSubmit = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        What best describes you?
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        This helps us personalize your experience with EventU.
      </p>

      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === role.id
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-red-300 hover:bg-red-50"
            }`}
            onClick={() => setSelectedRole(role.id)}
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

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedRole}
          className={`px-8 py-3 rounded-md font-medium ${
            selectedRole
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } transition-colors`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
