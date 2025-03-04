"use client";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Contact Us</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-6 text-gray-800 font-medium">
          Have questions or feedback about EventU? We'd love to hear from you!
          Fill out the form below or reach out to us directly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Get in Touch
            </h2>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800">Email</h3>
                <p className="text-gray-700">info@eventu.edu</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800">Phone</h3>
                <p className="text-gray-700">(123) 456-7890</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800">Office</h3>
                <p className="text-gray-700">
                  Student Center, Room 104
                  <br />
                  Montclair State University
                  <br />
                  1 Normal Ave
                  <br />
                  Montclair, NJ 07043
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800">Hours</h3>
                <p className="text-gray-700">
                  Monday - Friday: 9:00 AM - 5:00 PM
                  <br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
