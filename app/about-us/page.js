"use client";

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">About Us</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4 text-gray-800 font-medium">
          EventU is a comprehensive platform designed for university students
          and staff to discover, organize, and participate in campus events.
        </p>

        <p className="mb-4 text-gray-800 font-medium">
          Our mission is to enhance campus life by making it easier for everyone
          to stay connected and engaged with university activities and
          opportunities.
        </p>

        <h2 className="text-xl font-semibold text-red-600 mt-6 mb-3">
          Our Team
        </h2>
        <p className="mb-4 text-gray-800 font-medium">
          EventU was created by a passionate team of students from Montclair
          State University who wanted to solve the challenge of event discovery
          and participation on campus.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-red-100 p-4 rounded-md border border-red-200">
            <h3 className="font-semibold text-gray-800">Farouk</h3>
            <p className="text-sm text-gray-700">Lead Developer</p>
          </div>

          <div className="bg-red-100 p-4 rounded-md border border-red-200">
            <h3 className="font-semibold text-gray-800">Husam</h3>
            <p className="text-sm text-gray-700">UI/UX Designer</p>
          </div>

          <div className="bg-red-100 p-4 rounded-md border border-red-200">
            <h3 className="font-semibold text-gray-800">Franklyn</h3>
            <p className="text-sm text-gray-700">Backend Developer</p>
          </div>

          <div className="bg-red-100 p-4 rounded-md border border-red-200">
            <h3 className="font-semibold text-gray-800">Jeremy</h3>
            <p className="text-sm text-gray-700">Project Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}
