// app/cars/[id]/page.js (Server Component)

import { PrismaClient } from '@prisma/client';
import CarDetail from './CarDetail'; // Import the Client Component

const prisma = new PrismaClient();

async function getCar(id) {
  // Fetch car data from the database
  return await prisma.car.findUnique({
    where: { id: parseInt(id) },
  });
}

export default async function CarPage({ params }) {
  const car = await getCar(params.id);

  // Check if the car exists
  if (!car) {
    return <p>Car not found</p>;
  }

  // Pass the car data to the CarDetail component
  return (
    <CarDetail car={car} params={params} />
  );
}
