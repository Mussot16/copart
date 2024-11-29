"use client";
import { CldImage } from "next-cloudinary";

export default function CldImageComponent() {
  return (
    <CldImage
      src="cld-sample-5" // Replace with your Cloudinary image public ID
      width={500}
      height={500}
      crop="scale" // Valid Cloudinary crop type
      alt="Sample Image" // Optional for accessibility
    />
  );
}
