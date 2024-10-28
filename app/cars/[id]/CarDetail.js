"use client";

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function CarDetail({ car, params }) {
  const { data: session } = useSession();
  const [bidAmount, setBidAmount] = useState("");

  if (!car) {
    return <p className="text-red-500 font-bold">Car not found</p>;
  }

  const placeBid = async () => {
    if (!session) {
      alert("You need to be logged in to place a bid.");
      return;
    }

    const response = await fetch(`/api/cars/${params.id}/bid`, {
      method: 'POST',
      body: JSON.stringify({
        amount: bidAmount,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.success) {
      alert("Bid placed successfully");
    } else {
      alert("Failed to place bid");
    }
  };

  return (
    <div>
      <h1>{car.make} {car.model}</h1>
      <p>Price: ${car.price}</p>

      {session ? (
        <div>
          <input
            type="number"
            placeholder="Enter bid amount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <button onClick={placeBid}>Place Bid</button>
        </div>
      ) : (
        <p>Please log in to place a bid.</p>
      )}
    </div>
  );
}
