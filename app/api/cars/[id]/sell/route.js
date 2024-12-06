import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { id } = params;
  const { buyerId } = await req.json();

  if (!buyerId) {
    return NextResponse.json(
      { error: "Buyer ID is required to mark the car as sold" },
      { status: 400 }
    );
  }

  try {
    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    if (car.sold) {
      return NextResponse.json(
        { error: "Car is already marked as sold" },
        { status: 400 }
      );
    }

    // Update the car as sold
    const updatedCar = await prisma.car.update({
      where: { id: parseInt(id) },
      data: {
        sold: true,
        buyerId: parseInt(buyerId),
      },
    });

    return NextResponse.json({ car: updatedCar }, { status: 200 });
  } catch (error) {
    console.error("Error marking car as sold:", error);
    return NextResponse.json(
      { error: "Failed to mark car as sold" },
      { status: 500 }
    );
  }
}
