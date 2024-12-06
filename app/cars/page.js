// app/cars/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

async function getCars() {
  return await prisma.car.findMany({
    where: {
      sold: false, // Only fetch cars that are not sold
    },
  });
}

export default async function CarsPage() {
  const cars = await getCars();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Cars</h1>
      <ul>
        {cars.length > 0 ? (
          cars.map((car) => (
            <li key={car.id} className="mb-4">
              <Link href={`/cars/${car.id}`} className="text-blue-600 hover:underline">
                {car.make} {car.model} - ${car.price}
              </Link>
            </li>
          ))
        ) : (
          <p>No cars available at the moment.</p>
        )}
      </ul>
    </div>
  );
}
