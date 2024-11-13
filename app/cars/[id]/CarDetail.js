"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function CarDetail({ car, params }) {
  const { data: session } = useSession();
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(car.initialTimeLeft || "24:00:00");

  // Fetch bids when the component mounts
  useEffect(() => {
    const fetchBids = async () => {
      const response = await fetch(`/api/cars/${params.id}/bid`);
      if (response.ok) {
        const data = await response.json();
        setBids(data.bids);
      } else {
        console.error("Failed to fetch bids");
      }
    };
    fetchBids();
  }, [params.id]);

  // Establish WebSocket connection
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3002");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.remainingTime) {
        setTimeLeft(message.remainingTime);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const placeBid = async () => {
    if (!session) {
      alert("You need to be logged in to place a bid.");
      return;
    }

    const response = await fetch(`/api/cars/${params.id}/bid`, {
      method: 'POST',
      body: JSON.stringify({
        userId: session.user.id,
        amount: bidAmount,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.success) {
      setBids([...bids, data.bid]); // Update bids with the new bid
      setBidAmount("");
      alert("Bid placed successfully");
    } else {
      alert("Failed to place bid");
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md max-w-lg mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-800">
        {car.make} {car.model}
      </h1>
      <p className="text-xl font-semibold mb-2">
        Starting Price: <span className="text-green-600">${car.price}</span>
      </p>
      <p className="text-lg font-medium mb-4">Time Left: {timeLeft}</p>

      {session ? (
        <div className="flex flex-col items-center space-y-4">
          <input
            type="number"
            placeholder="Enter bid amount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={placeBid}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold"
          >
            Place Bid
          </button>
        </div>
      ) : (
        <p className="text-center text-red-600 mt-4">
          Please log in to place a bid.
        </p>
      )}

      <h2 className="text-2xl font-semibold mt-8 mb-4">Current Bids</h2>
      <ul className="space-y-2">
        {bids.map((bid, index) => (
          <li key={index} className="bg-white p-3 rounded-md shadow-sm">
            <span className="text-lg font-bold text-gray-700">
              ${bid.amount}
            </span>{' '}
            by{' '}
            <span className="text-blue-600">
              {bid.user?.name || 'Unknown User'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
