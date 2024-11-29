import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, res) {
  try {
    const makes = await prisma.car.findMany({
      select: {
        make: true,
      },
      distinct: ['make'],
    });

    const uniqueMakes = makes.map((car) => car.make);
    return new Response(JSON.stringify({ makes: uniqueMakes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch car makes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
