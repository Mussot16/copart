const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers });
    const formData = {};

    busboy.on('file', (fieldname, file, filename) => {
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
      const writeStream = fs.createWriteStream(uploadPath);
      file.pipe(writeStream);

      writeStream.on('close', () => {
        formData['file'] = `/uploads/${filename}`;
      });
    });

    busboy.on('field', (fieldname, value) => {
      formData[fieldname] = value;
    });

    busboy.on('finish', () => {
      resolve(formData);
    });

    busboy.on('error', (error) => {
      reject(error);
    });

    req.pipe(busboy);
  });
}

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export async function POST(req) {
  try {
    console.log('Processing file upload...');

    const formData = await parseForm(req);

    if (!formData.file) {
      console.error('File upload failed: file is missing');
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }

    const { make, model, year, price, description } = formData;

    if (!make || !model || !year || !price) {
      console.error('Missing required form fields');
      return NextResponse.json({ error: 'Missing required form fields' }, { status: 400 });
    }

    const car = await prisma.car.create({
      data: {
        make,
        model,
        year: parseInt(year),
        price: parseFloat(price),
        imageUrl: formData.file,
        description,
      },
    });

    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'File upload failed', details: error.message }, { status: 500 });
  }
}
