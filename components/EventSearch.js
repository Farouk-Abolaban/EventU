"use client";

import { useState } from "react";
import { Search, Calendar, MapPin, Filter, X } from "lucide-react";

export default function EventSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    date: "",
    location: "",
  });

  // Categories for the filter dropdown
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "workshops", name: "Workshops" },
    { id: "conferences", name: "Conferences" },
    { id: "social", name: "Social Events" },
    { id: "webinars", name: "Webinars" },
  ];

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: "all",
      date: "",
      location: "",
    });
  };

  // Submit search and filters
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        searchTerm,
        ...filters,
      });
    }
  };

  return (
    <div className="w-full mb-8">
      <form onSubmit={handleSubmit}>
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <div className="px-3 flex items-center">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for events..."
              className="flex-grow py-3 px-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-3 text-gray-600 transition-colors border-l border-gray-300"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Filters</h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-red-600 text-sm hover:underline flex items-center"
              >
                <X size={16} className="mr-1" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="date"
                >
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="location"
                >
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Any location"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <MapPin
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-sm"
        >
          Search Events
        </button>
      </form>
    </div>
  );
}
