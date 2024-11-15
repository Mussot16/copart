// app/page.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCars() {
  return await prisma.car.findMany();
}

export default async function Home() {
  const cars = await getCars();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-5xl font-bold text-center mb-12">Find Your Dream Car</h1>

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
