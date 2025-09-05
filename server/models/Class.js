import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    mode: { type: String, enum: ['Online','Offline'], default: 'Online' },
    startDate: { type: String, default: '' },
    durationWeeks: { type: Number, default: 4, min: 1 },
    seats: { type: Number, default: 10, min: 1 },
    price: { type: Number, min: 0, default: 0 },
    level: { type: String, enum: ['Beginner','Intermediate','Advanced'], default: 'Beginner' },
    cover: { type: String, default: '' }, // /api/images/:id
    description: { type: String, default: '' },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Class', classSchema);
