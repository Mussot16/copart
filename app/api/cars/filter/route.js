import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { make, year, priceRange, color } = await req.json();

  console.log("Filter Parameters:", { make, year, priceRange, color });

  const filters = {};
  if (make) filters.make = make;
  if (year) filters.year = parseInt(year, 10);
  if (color) filters.color = color;
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-");
    filters.price = {
      gte: parseFloat(minPrice),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    };
  }

  try {
    const cars = await prisma.car.findMany({
      where: filters,
    });

    console.log("Filtered Cars:", cars);
    return new Response(JSON.stringify({ cars }), { status: 200 });
  } catch (error) {
    console.error("Error fetching filtered cars:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch cars" }), { status: 500 });
  }
}
