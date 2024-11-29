"use client";

import { useState, useEffect } from "react";
import Filter from "./components/Filter";

export default function Home() {
  const [cars, setCars] = useState([]);

  // Fetch all cars initially
  useEffect(() => {
    const fetchCars = async () => {
      const response = await fetch("/api/cars");
      if (response.ok) {
        const data = await response.json();
        setCars(data.cars);
      } else {
        console.error("Failed to fetch cars");
      }
    };
    fetchCars();
  }, []);

  const handleFilterChange = (filteredCars) => {
    setCars(filteredCars);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-5xl font-bold text-center mb-12">Find Your Dream Car</h1>

      {/* Add Filter Component */}
      <div className="mb-6">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      <div className="flex justify-end mb-6">
        <a href="/cars/add" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Add a Car
        </a>
      </div>

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div key={car.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              {car.imageUrl && (
                <img
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <a href={`/cars/${car.id}`} className="text-2xl font-bold text-blue-600 hover:underline">
                  {car.make} {car.model}
                </a>
                <p className="text-lg font-semibold text-green-600 mt-2">${car.price}</p>
                <p className="text-gray-700 mt-2">{car.description}</p>
                <a href={`/cars/${car.id}`} className="text-blue-500 hover:text-blue-700 mt-4 block">
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-red-600 font-semibold">No cars available at the moment</p>
      )}
    </div>
  );
}
