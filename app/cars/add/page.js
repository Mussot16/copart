"use client";
import { useState } from "react";

export default function CarForm() {
  const [file, setFile] = useState(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(""); // Optional color
  const [mileage, setMileage] = useState(""); // Optional mileage
  const [ownerId, setOwnerId] = useState(""); // Required ownerId
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("color", color); // Optional
    formData.append("mileage", mileage); // Optional
    formData.append("ownerId", ownerId); // Required

    try {
      const response = await fetch("/api/cars/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ text: "Car added successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to add car.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Something went wrong!", type: "error" });
      console.error("Error submitting car form:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Add a Car</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label>Make</label>
          <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            required
            className="block w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            className="block w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className="block w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="block w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="block w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Mileage</label>
          <input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="block w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Owner ID</label>
          <input
            type="text"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            required
            className="block w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Car Image</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="block w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-center text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
