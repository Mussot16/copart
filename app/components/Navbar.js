"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar({ onFilterChange }) {
  const { data: session } = useSession();
  const [carMakes, setCarMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch distinct car makes from the API
  useEffect(() => {
    const fetchMakes = async () => {
      const response = await fetch("/api/cars/makes");
      const data = await response.json();
      setCarMakes(data.makes || []);
    };
    fetchMakes();
  }, []);

  // Handle filter changes
  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    onFilterChange({ make: e.target.value, year: selectedYear, priceRange: selectedPriceRange });
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    onFilterChange({ make: selectedMake, year: e.target.value, priceRange: selectedPriceRange });
  };

  const handlePriceChange = (e) => {
    setSelectedPriceRange(e.target.value);
    onFilterChange({ make: selectedMake, year: selectedYear, priceRange: e.target.value });
  };

  return (
    <nav className="p-4 bg-blue-600 text-white flex flex-col sm:flex-row justify-between items-center">
      <div className="flex gap-6 items-center">
        <Link href="/" className="py-2 px-4 rounded hover:bg-blue-700">Home</Link>
        
        {/* Cars Link with Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link href="/cars" className="py-2 px-4 rounded hover:bg-blue-700">Cars</Link>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white text-gray-700 rounded-lg shadow-lg p-4 w-48">
              {/* Make Filter */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">Make</label>
                <select
                  value={selectedMake}
                  onChange={handleMakeChange}
                  className="w-full p-2 rounded border"
                >
                  <option value="">All Makes</option>
                  {carMakes.map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="w-full p-2 rounded border"
                >
                  <option value="">All Years</option>
                  {[2023, 2022, 2021, 2020, 2019].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block font-semibold mb-1">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={handlePriceChange}
                  className="w-full p-2 rounded border"
                >
                  <option value="">All Prices</option>
                  <option value="0-20000">Up to $20,000</option>
                  <option value="20001-50000">$20,001 - $50,000</option>
                  <option value="50001-100000">$50,001 - $100,000</option>
                  <option value="100001">Above $100,000</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {session && (
          <Link href="/profile" className="py-2 px-4 rounded hover:bg-blue-700">Profile</Link>
        )}
      </div>

      <div className="flex gap-6">
        <Link href="/cart" className="py-2 px-4 rounded hover:bg-blue-700">Cart</Link>
        {!session ? (
          <>
            <Link href="/register" className="py-2 px-4 rounded hover:bg-blue-700">Register</Link>
            <Link href="/login" className="py-2 px-4 rounded hover:bg-blue-700">Login</Link>
          </>
        ) : (
          <button
            onClick={() => signOut()}
            className="py-2 px-4 rounded bg-red-600 hover:bg-red-700"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
