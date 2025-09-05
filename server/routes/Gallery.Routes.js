// service/src/routes/Gallery.Routes.js
import { Router } from "express";
import GalleryItem from "../models/GalleryItem.js";
import mongoose from "mongoose";
// import { verifyAccess, verifyAdmin } from '../middleware/auth.js';

const router = Router();

// Lazy Cloudinary loader with credential check
let _cloud = null;
const getCloudinary = async () => {
  if (_cloud) return _cloud;
  try {
    const mod = await import("cloudinary"); // requires `npm i cloudinary` in this package
    const cloud = mod.v2;
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
      cloud.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET
      });
      _cloud = cloud;
      return _cloud;
    }
    return null;
  } catch {
    // SDK not installed in this package; skip server-side deletions
    return null;
  }
};

// GET /api/gallery - list gallery items (newest first)
router.get("/", /*verifyAccess, verifyAdmin,*/ async (req, res, next) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (e) { next(e); }
});

// POST /api/gallery - create items from [{url, publicId}]
router.post("/", /*verifyAccess, verifyAdmin,*/ async (req, res, next) => {
  try {
    const arr = Array.isArray(req.body?.images) ? req.body.images : [];
    if (!arr.length) return res.status(400).json({ message: "images array required" });

    const docs = arr.map((img) => ({
      url: String(img.url).trim(),
      publicId: img.publicId ? String(img.publicId).trim() : undefined,
      uploadedBy: req.userId || undefined
    }));

    const created = await GalleryItem.insertMany(docs);
    res.status(201).json({ items: created });
  } catch (e) { next(e); }
});

// DELETE /api/gallery/:idOrUrl - delete by ObjectId or exact URL
router.delete("/:idOrUrl", /*verifyAccess, verifyAdmin,*/ async (req, res, next) => {
  try {
    const raw = decodeURIComponent(req.params.idOrUrl);
    let doc = null;

    if (mongoose.isValidObjectId(raw)) {
      doc = await GalleryItem.findByIdAndDelete(raw);
    } else {
      doc = await GalleryItem.findOneAndDelete({ url: raw });
    }

    if (!doc) return res.status(404).json({ message: "Not found" });

    // Optional Cloudinary deletion if SDK and creds are present
    if (doc.publicId) {
      const cloud = await getCloudinary();
      if (cloud?.uploader) {
        try {
          await cloud.uploader.destroy(doc.publicId);
        } catch (err) {
          console.error("Cloudinary destroy failed:", err?.message);
        }
      }
    }

    res.json({ ok: true, id: doc._id });
  } catch (e) { next(e); }
});

export default router;
