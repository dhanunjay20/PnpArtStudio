// service/src/routes/classes.routes.js
import { Router } from 'express';
import ClassModel from '../models/Class.js';

const router = Router();

// List
router.get('/', async (req, res, next) => {
  try {
    const { published } = req.query;
    const q = {};
    if (published === 'true') q.published = true;
    if (published === 'false') q.published = false;
    const items = await ClassModel.find(q).sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) { next(e); }
});

// Get one
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await ClassModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

// Create (JSON body, cover = Cloudinary URL)
router.post('/', async (req, res, next) => {
  try {
    const b = req.body || {};
    const payload = {
      title: b.title,
      mode: b.mode || 'Online',
      startDate: b.startDate || '',
      durationWeeks: b.durationWeeks ? Number(b.durationWeeks) : 4,
      seats: b.seats ? Number(b.seats) : 10,
      price: b.price ? Number(b.price) : 0,
      level: b.level || 'Beginner',
      cover: b.cover || '',
      description: b.description || '',
      published: b.published === true || b.published === 'true',
    };
    const doc = await ClassModel.create(payload);
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

// Update (JSON)
router.put('/:id', async (req, res, next) => {
  try {
    const b = req.body || {};
    const update = {
      title: b.title,
      mode: b.mode,
      startDate: b.startDate,
      durationWeeks: b.durationWeeks !== undefined ? Number(b.durationWeeks) : undefined,
      seats: b.seats !== undefined ? Number(b.seats) : undefined,
      price: b.price !== undefined ? Number(b.price) : undefined,
      level: b.level,
      cover: b.cover,
      description: b.description,
      published: b.published !== undefined ? (b.published === true || b.published === 'true') : undefined,
    };
    const doc = await ClassModel.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await ClassModel.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
