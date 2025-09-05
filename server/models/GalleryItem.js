// service/src/models/GalleryItem.js
import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true }, // optional: used for server-side deletion in routes
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Hide __v in JSON responses but keep versioning internally if needed
GalleryItemSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("GalleryItem", GalleryItemSchema);
