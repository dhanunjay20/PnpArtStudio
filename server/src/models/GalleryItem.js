import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, default: 'Untitled' },
    category: { type: String, required: true, enum: ['Paintings', 'Handcrafted Items', 'Exhibitions', 'Other'], default: 'Paintings' },
    year: { type: Number, default: new Date().getFullYear(), index: true },
    medium: { type: String, default: '' },
    description: { type: String, default: '' },
    src: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: '' },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

// Text index for search across multiple fields
GalleryItemSchema.index({ title: 'text', description: 'text', medium: 'text' });

export default mongoose.model('GalleryItem', GalleryItemSchema);
