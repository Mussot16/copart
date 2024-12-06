import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { id } = params;
  const { amount, userId } = await req.json();

  if (!amount || !userId) {
    return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
  }

  try {
    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) },
    });

    if (!car) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    if (car.sold) {
      return NextResponse.json({ success: false, error: "Car is already sold" }, { status: 400 });
    }

    if (parseFloat(amount) >= car.buyNowPrice) {
      await prisma.car.update({
        where: { id: parseInt(id) },
        data: { sold: true, buyerId: parseInt(userId) },
      });

      return NextResponse.json({
        success: true,
        message: "Car purchased via Buy Now price",
      });
    }

    const bid = await prisma.bid.create({
      data: {
        amount: parseFloat(amount),
        userId: parseInt(userId),
        carId: parseInt(id),
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json({ success: true, bid }, { status: 201 });
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json({ success: false, error: "Failed to place bid" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const bids = await prisma.bid.findMany({
      where: { carId: parseInt(id) },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });

    const highestBid = bids.length > 0 ? bids[0].amount : 0;

    return NextResponse.json({ bids, highestBid }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 });
  }
}
