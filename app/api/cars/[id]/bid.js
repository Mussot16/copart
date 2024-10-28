import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const { amount } = req.body;

    try {
      // Create a new bid in the database
      const bid = await prisma.bid.create({
        data: {
          amount: parseFloat(amount),
          userId: 1,  // This should be the logged-in user ID (hardcoded for now)
          carId: parseInt(id),
        },
      });

      res.status(201).json({ success: true, bid });
    } catch (error) {
      console.error('Error placing bid:', error);
      res.status(500).json({ success: false, error: 'Failed to place bid' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
