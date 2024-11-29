"use client";

import { useState, useEffect } from "react";

export default function Filter({ onFilterChange }) {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availableColors, setAvailableColors] = useState([]);

  useEffect(() => {
    // Fetch distinct colors from API
    const fetchColors = async () => {
      try {
        const response = await fetch("/api/cars/colors");
        if (response.ok) {
          const data = await response.json();
          setAvailableColors(data.colors || []);
        } else {
          console.error("Failed to fetch colors");
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColors();
  }, []);

  const handleApplyFilters = async () => {
    const response = await fetch("/api/cars/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        make: selectedMake,
        year: selectedYear,
        priceRange: selectedPriceRange,
        color: selectedColor,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (onFilterChange) onFilterChange(data.cars);
    } else {
      console.error("Failed to fetch filtered cars");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-wrap gap-4 items-center">
      {/* Make Filter */}
      <select
        value={selectedMake}
        onChange={(e) => setSelectedMake(e.target.value)}
        className="border rounded-lg p-2 w-32"
      >
        <option value="">Make</option>
        <option value="Toyota">Toyota</option>
        <option value="Ford">Ford</option>
        <option value="Tesla">Tesla</option>
      </select>

      {/* Year Filter */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="border rounded-lg p-2 w-32"
      >
        <option value="">Year</option>
        {[2023, 2022, 2021, 2020, 2019].map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Price Range Filter */}
      <select
        value={selectedPriceRange}
        onChange={(e) => setSelectedPriceRange(e.target.value)}
        className="border rounded-lg p-2 w-32"
      >
        <option value="">Price</option>
        <option value="0-20000">Up to $20,000</option>
        <option value="20001-50000">$20,001 - $50,000</option>
        <option value="50001-100000">$50,001 - $100,000</option>
        <option value="100001">Above $100,000</option>
      </select>

      {/* Color Filter */}
      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="border rounded-lg p-2 w-32"
      >
        <option value="">Color</option>
        {availableColors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>

      <button
        onClick={handleApplyFilters}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Apply
      </button>
    </div>
  );
}
