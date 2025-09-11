// server/controllers/gallery.controller.js
import GalleryItem from '../models/GalleryItem.js';
import { v2 as cloudinary } from 'cloudinary';

// Escape user input for safe regex
const escapeRegex = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/gallery
export async function listGallery(req, res, next) {
  try {
    // Distinct categories helper
    if (req.query.distinct === 'category') {
      const values = await GalleryItem.distinct('category');
      return res.json({ values });
    }

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '24', 10)));
    const q = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();

    const match = {};
    if (category && category !== 'All') match.category = category;

    let items = [];
    let total = 0;

    if (q) {
      // Preferred: top-level $text per MongoDB rules (NOT inside $or)
      try {
        const textMatch = { ...match, $text: { $search: q } };
        total = await GalleryItem.countDocuments(textMatch);
        items = await GalleryItem.find(textMatch, { score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' }, createdAt: -1, _id: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();
      } catch (e) {
        // Fallback: case-insensitive partial match for substring searches or missing index
        const rx = new RegExp(escapeRegex(q), 'i');
        const rxMatch = {
          ...match,
          $or: [
            { title: rx },
            { description: rx },
            { medium: rx }
          ]
        };
        total = await GalleryItem.countDocuments(rxMatch);
        items = await GalleryItem.find(rxMatch)
          .sort({ createdAt: -1, _id: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();
      }
    } else {
      // No search term
      const base = GalleryItem.find(match);
      total = await base.clone().countDocuments();
      items = await base
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    }

    return res.json({
      items,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit))
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/gallery
// Accepts either { items: [...] } or { images: [...], meta: {...} }
export async function createGalleryItems(req, res, next) {
  try {
    const body = req.body || {};
    let docs = [];

    if (Array.isArray(body.items) && body.items.length) {
      docs = body.items.map((it) => ({
        title: it.title || 'Untitled',
        category: it.category || 'Paintings',
        year: Number(it.year) || new Date().getFullYear(),
        medium: it.medium || '',
        description: it.description || '',
        src: it.src,
        cloudinaryPublicId: it.cloudinaryPublicId || '',
        tags: Array.isArray(it.tags) ? it.tags : []
      }));
    } else if (Array.isArray(body.images) && body.images.length) {
      const meta = body.meta || {};
      docs = body.images.map((im) => ({
        title: meta.title || 'Untitled',
        category: meta.category || 'Paintings',
        year: Number(meta.year) || new Date().getFullYear(),
        medium: meta.medium || '',
        description: meta.description || '',
        src: im.url,
        cloudinaryPublicId: im.publicId || '',
        tags: Array.isArray(meta.tags) ? meta.tags : []
      }));
    } else {
      return res.status(400).json({ message: 'No items or images provided' });
    }

    if (!docs.every(d => d?.src)) {
      return res.status(400).json({ message: 'Each item requires src' });
    }

    const created = await GalleryItem.insertMany(docs);
    res.status(201).json({ items: created });
  } catch (err) {
    console.error('POST /api/gallery error:', err?.message);
    next(err);
  }
}

// PATCH /api/gallery/:id
export async function updateGalleryItem(req, res, next) {
  try {
    const id = req.params.id;
    const payload = {};
    ['title', 'category', 'year', 'medium', 'description', 'tags', 'src', 'cloudinaryPublicId'].forEach((k) => {
      if (k in req.body) payload[k] = req.body[k];
    });

    if (req.body.oldPublicId && req.body.oldPublicId !== req.body.cloudinaryPublicId) {
      try { await cloudinary.uploader.destroy(req.body.oldPublicId); }
      catch (e) { console.error('Cloudinary destroy failed:', e?.message); }
    }

    await GalleryItem.updateOne({ _id: id }, { $set: payload });
    const updated = await GalleryItem.findById(id).lean();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { next(err); }
}

// DELETE /api/gallery/:id
export async function deleteGalleryItem(req, res, next) {
  try {
    const id = req.params.id;
    const doc = await GalleryItem.findById(id).lean();
    if (!doc) return res.status(404).json({ message: 'Not found' });

    if (doc.cloudinaryPublicId) {
      try { await cloudinary.uploader.destroy(doc.cloudinaryPublicId); }
      catch (e) { console.error('Cloudinary destroy failed:', e?.message); }
    }

    await GalleryItem.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (err) { next(err); }
}
