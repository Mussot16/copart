"use client";
import { useState } from "react";

export default function CarForm() {
  const [file, setFile] = useState(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState(""); // Optional description
  const [message, setMessage] = useState(""); // For user feedback

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("price", price);
    formData.append("description", description); // Optional description

    const res = await fetch("/api/cars/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Car added successfully!");
    } else {
      setMessage("Failed to add car.");
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
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
