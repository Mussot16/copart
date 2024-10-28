// app/page.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCars() {
  return await prisma.car.findMany();
}

export default async function Home() {
  const cars = await getCars();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Car Auctions</h1>

      {/* Add Car button */}
      <div className="mb-4">
        <a href="/cars/add" className="text-blue-600 hover:underline">Add a Car</a>
      </div>

      {cars.length > 0 ? (
        <ul className="space-y-4">
          {cars.map((car) => (
            <li key={car.id} className="p-4 border rounded-lg shadow hover:shadow-lg transition flex items-center space-x-4">
              {/* Display car image */}
              {car.imageUrl && (
                <img
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div>
                <a href={`/cars/${car.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                  {car.make} {car.model} - <span className="text-green-600">${car.price}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-red-600 font-semibold">No cars available</p>
      )}
    </div>
  );
}
