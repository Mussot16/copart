import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { id } = params;
  const { userId } = await req.json();

  try {
    // Fetch the car to ensure it's available for purchase
    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) },
    });

    if (!car) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    if (car.sold) {
      return NextResponse.json({ success: false, error: "Car is already sold" }, { status: 400 });
    }

    // Mark the car as sold and set the buyer
    const updatedCar = await prisma.car.update({
      where: { id: parseInt(id) },
      data: { sold: true, buyerId: parseInt(userId) },
    });

    return NextResponse.json({ success: true, car: updatedCar }, { status: 200 });
  } catch (error) {
    console.error("Error completing purchase:", error);
    return NextResponse.json({ success: false, error: "Failed to complete purchase" }, { status: 500 });
  }
}
