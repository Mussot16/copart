import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Fetch cars that are not sold
    const cars = await prisma.car.findMany({
      where: {
        sold: false, // Only include cars that are not sold
      },
      include: {
        owner: { select: { name: true } }, // Optional: Include owner information
      },
    });

    return new Response(JSON.stringify({ cars }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch cars" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
