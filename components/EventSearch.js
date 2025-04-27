"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function EventSearch({ onSearch }) {
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    category: "all",
    date: "",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleReset = () => {
    setSearchData({
      searchTerm: "",
      category: "all",
      date: "",
      location: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <input
              type="text"
              name="searchTerm"
              value={searchData.searchTerm}
              onChange={handleInputChange}
              placeholder="Search events..."
              className="flex-grow p-3 outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white p-3 transition"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={searchData.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Categories</option>
              <option value="workshops">Workshops</option>
              <option value="conferences">Conferences</option>
              <option value="social">Social Events</option>
              <option value="webinars">Webinars</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={searchData.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={searchData.location}
              onChange={handleInputChange}
              placeholder="Campus location..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
