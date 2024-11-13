import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Named export for POST method
export async function POST(req, { params }) {
  const { id } = params;
  const { amount, userId } = await req.json(); // Get amount and userId from request body

  try {
    // Create a new bid in the database
    const bid = await prisma.bid.create({
      data: {
        amount: parseFloat(amount),
        userId: parseInt(userId), // Ensure this is passed from the client
        carId: parseInt(id),
      },
    });

    return NextResponse.json({ success: true, bid }, { status: 201 });
  } catch (error) {
    console.error('Error placing bid:', error);
    return NextResponse.json({ success: false, error: 'Failed to place bid' }, { status: 500 });
  }
}

// Named export for GET method
export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Fetch all bids for the specific car along with the user who placed each bid
    const bids = await prisma.bid.findMany({
      where: { carId: parseInt(id) },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true }, // Select only the user's name
        },
      },
    });
    
    return NextResponse.json({ bids }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json({ error: 'Failed to fetch bids' }, { status: 500 });
  }
}

