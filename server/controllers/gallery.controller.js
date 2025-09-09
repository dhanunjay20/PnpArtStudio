// service/src/controllers/gallery.controller.js
import GalleryItem from '../models/GalleryItem.js';
import mongoose from 'mongoose';

let _cloud = null;
async function getCloudinary() {
  if (_cloud) return _cloud;
  try {
    const mod = await import('cloudinary');
    const cloud = mod.v2;
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
      cloud.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
      });
      _cloud = cloud;
      return _cloud;
    }
    return null;
  } catch {
    return null;
  }
}

// GET /api/gallery
export async function listGallery(req, res, next) {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (e) { next(e); }
}

// POST /api/gallery { images: [{url, publicId}] }
export async function createGalleryItems(req, res, next) {
  try {
    const arr = Array.isArray(req.body?.images) ? req.body.images : [];
    if (!arr.length) return res.status(400).json({ message: 'images array required' });
    const docs = arr.map((img) => ({
      url: String(img.url).trim(),
      publicId: img.publicId ? String(img.publicId).trim() : undefined,
      uploadedBy: req.userId || undefined,
    }));
    const created = await GalleryItem.insertMany(docs);
    res.status(201).json({ items: created });
  } catch (e) { next(e); }
}

// DELETE /api/gallery/:idOrUrl
export async function deleteGalleryItem(req, res, next) {
  try {
    const raw = decodeURIComponent(req.params.idOrUrl);
    let doc = null;
    if (mongoose.isValidObjectId(raw)) {
      doc = await GalleryItem.findByIdAndDelete(raw);
    } else {
      doc = await GalleryItem.findOneAndDelete({ url: raw });
    }
    if (!doc) return res.status(404).json({ message: 'Not found' });

    if (doc.publicId) {
      const cloud = await getCloudinary();
      if (cloud?.uploader) {
        try { await cloud.uploader.destroy(doc.publicId); } catch (err) { console.error('Cloudinary destroy failed:', err?.message); }
      }
    }

    res.json({ ok: true, id: doc._id });
  } catch (e) { next(e); }
}
