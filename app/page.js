"use client";

import { useState, useEffect } from "react";
import Filter from "./components/Filter";

export default function Home() {
  const [cars, setCars] = useState([]);

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
    <div className="max-w-7xl mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Find Your Dream Car</h1>
        <p className="text-lg text-gray-600">Explore and bid on the best cars in the market.</p>
      </header>

      {/* Filter Section */}
      <div className="flex justify-between items-center mb-10">
        <Filter onFilterChange={handleFilterChange} />
        <a
          href="/cars/add"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
        >
          Add a Car
        </a>
      </div>

      {/* Car Listings */}
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300 bg-white"
            >
              {car.imageUrl && (
                <img
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <a
                  href={`/cars/${car.id}`}
                  className="text-xl font-bold text-blue-600 hover:underline"
                >
                  {car.make} {car.model}
                </a>
                <p className="text-lg font-semibold text-green-600 mt-2">${car.price}</p>
                <p className="text-gray-700 mt-2 line-clamp-2">{car.description}</p>
                <a
                  href={`/cars/${car.id}`}
                  className="inline-block mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No cars available at the moment.</p>
      )}
    </div>
  );
}
