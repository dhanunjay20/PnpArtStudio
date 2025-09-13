// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true, required: true, lowercase: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true }, // bcrypt hash
    role: { type: String, enum: ['admin','user'], default: 'admin' }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
