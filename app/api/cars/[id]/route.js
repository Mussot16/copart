import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Fetch the car details, including bids and buyer information
    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) },
      include: {
        bids: {
          orderBy: { amount: "desc" }, // Order bids by highest first
          include: { user: { select: { name: true } } }, // Include user details
        },
        buyer: { select: { name: true } }, // Include buyer information if sold
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const highestBid = car.bids.length > 0 ? car.bids[0].amount : car.price;

    return NextResponse.json(
      {
        car: {
          ...car,
          highestBid,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching car details:", error);
    return NextResponse.json(
      { error: "Failed to fetch car details" },
      { status: 500 }
    );
  }
}
