import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { broadcast } from "@/server"; // Import broadcast function

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { id } = params;
  const { amount, userId } = await req.json();

  if (!amount || !userId) {
    return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
  }

  try {
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

    // Notify WebSocket server of the new bid
    broadcast({ type: "new_bid", bid });

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

    return NextResponse.json({ bids }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 });
  }
}
