// src/config/db.js
import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true); // optional strict mode [12]
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
