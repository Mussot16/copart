"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function CarDetail({ car, params }) {
  const { data: session } = useSession();
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState(car.price);
  const [timeLeft, setTimeLeft] = useState("24:00:00");
  const [buyNowPrice, setBuyNowPrice] = useState(car.buyNowPrice || null);
  const [sold, setSold] = useState(car.sold);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setBids(data.car.bids);
          setHighestBid(data.car.highestBid);
          setSold(data.car.sold);
        } else {
          console.error("Failed to fetch car details");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();

    const intervalId = setInterval(fetchCarDetails, 5000);

    return () => clearInterval(intervalId);
  }, [params.id]);

  const placeBid = async () => {
    if (!session) {
      alert("You need to be logged in to place a bid.");
      return;
    }

    if (parseFloat(bidAmount) <= highestBid) {
      alert("Your bid must be higher than the current highest bid.");
      return;
    }

    try {
      const response = await fetch(`/api/cars/${params.id}/bid`, {
        method: "POST",
        body: JSON.stringify({ userId: session.user.id, amount: parseFloat(bidAmount) }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setBidAmount("");
        alert("Your bid was placed successfully.");
      } else {
        const errorData = await response.json();
        alert(`Failed to place bid: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("An unexpected error occurred.");
    }
  };

  const buyNow = async () => {
    if (!session) {
      alert("You need to be logged in to buy the car.");
      return;
    }

    try {
      const response = await fetch(`/api/cars/${params.id}/buy-now`, {
        method: "POST",
        body: JSON.stringify({ userId: session.user.id }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("Congratulations! You bought the car.");
        setSold(true);
      } else {
        const errorData = await response.json();
        alert(`Failed to complete purchase: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error completing purchase:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto my-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">
        {car.make} {car.model}
      </h1>
      <div className="mb-6">
        <img
          src={car.imageUrl || "/placeholder-car.jpg"}
          alt={`${car.make} ${car.model}`}
          className="w-full h-64 object-cover rounded-md shadow-sm"
        />
      </div>
      <div className="text-lg space-y-2">
        <p>
          <strong>Starting Price:</strong>{" "}
          <span className="text-green-600">${car.price}</span>
        </p>
        <p>
          <strong>Highest Bid:</strong>{" "}
          <span className="text-green-600">${highestBid}</span>
        </p>
        {buyNowPrice && (
          <p>
            <strong>Buy Now Price:</strong>{" "}
            <span className="text-green-600">${buyNowPrice}</span>
          </p>
        )}
        <p>
          <strong>Time Left:</strong> {timeLeft}
        </p>
      </div>

      {sold ? (
        <div className="mt-6 p-4 bg-red-600 text-white rounded-md text-center">
          <h2 className="text-2xl font-bold">This car has been sold!</h2>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 mt-6">
          {session ? (
            <>
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
              {buyNowPrice && (
                <button
                  onClick={buyNow}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-semibold"
                >
                  Buy Now for ${buyNowPrice}
                </button>
              )}
            </>
          ) : (
            <p className="text-center text-red-600">Please log in to place a bid or buy the car.</p>
          )}
        </div>
      )}

      {!sold && (
        <div>
          <h2 className="text-2xl font-semibold mt-8">Current Bids</h2>
          <ul className="bg-gray-50 p-4 rounded-md shadow-sm mt-4 space-y-2">
            {bids.map((bid, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-lg font-bold text-gray-700">${bid.amount}</span>
                <span className="text-blue-600">{bid.user?.name || "Unknown User"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
