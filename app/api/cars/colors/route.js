import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const colors = await prisma.car.findMany({
      select: { color: true },
      distinct: ["color"],
    });

    const uniqueColors = colors.map((c) => c.color).filter(Boolean);

    return new Response(JSON.stringify({ colors: uniqueColors }), { status: 200 });
  } catch (error) {
    console.error("Error fetching colors:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch colors" }), { status: 500 });
  }
}
