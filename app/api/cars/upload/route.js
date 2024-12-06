import { PrismaClient } from "@prisma/client";
import busboy from "busboy";
import { Readable } from "stream";
import cloudinary from "../../../../utils/cloudinary";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing
  },
};

// Helper function to convert ReadableStream to Node.js Readable
function toNodeReadable(stream) {
  return Readable.from((async function* () {
    const reader = stream.getReader();
    let done = false;
    while (!done) {
      const { value, done: isDone } = await reader.read();
      done = isDone;
      if (value) yield value;
    }
  })());
}

// Helper to parse multipart form data
async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return reject(new Error("Missing or invalid Content-Type header"));
    }

    const bb = busboy({ headers: { "content-type": contentType } });
    const fields = {};
    const files = [];

    bb.on("field", (name, value) => {
      fields[name] = value;
    });

    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      file.on("data", (chunk) => chunks.push(chunk));
      file.on("end", () => {
        files.push({
          fieldname: name,
          originalname: filename,
          buffer: Buffer.concat(chunks),
          mimeType,
        });
      });
    });

    bb.on("close", () => resolve({ fields, files }));
    bb.on("error", (err) => reject(err));

    const nodeReadable = toNodeReadable(req.body); // Convert to Node.js Readable
    nodeReadable.pipe(bb);
  });
}

export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req);

    if (!files.length) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const { make, model, year, price, description, color, mileage, ownerId, buyNowPrice } = fields;

    if (!make || !model || !year || !price || !ownerId || !buyNowPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const file = files[0];

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "car_marketplace" },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    // Save car details to the database
    const car = await prisma.car.create({
      data: {
        make,
        model,
        year: parseInt(year, 10),
        price: parseFloat(price),
        buyNowPrice: parseFloat(buyNowPrice), // Added buyNowPrice
        description,
        color, // Optional field
        mileage: mileage ? parseInt(mileage, 10) : null, // Optional field
        imageUrl: uploadResult.secure_url,
        owner: {
          connect: { id: parseInt(ownerId, 10) }, // Connect the car to an existing owner
        },
      },
    });

    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    console.error("Error handling file upload:", error.message);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
