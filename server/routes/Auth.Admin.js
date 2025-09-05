// api/routes/auth.admin.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = Router();
const ACCESS_TTL = '15m';
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const setRefreshCookie = (res, token) =>
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: REFRESH_TTL_MS,
    path: '/api/auth/refresh'
  });

// POST /api/auth/admin/register
router.post('/admin/register', async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail }).lean();
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone || '').trim() || undefined,
      passwordHash,
      isAdmin: true
    });

    try {
      // if JWT_SECRET is missing, this throws; we catch and roll back the user
      const accessToken = jwt.sign({ sub: user._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL });
      const refreshToken = jwt.sign({ sub: user._id, type: 'refresh', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

      setRefreshCookie(res, refreshToken);
      return res.status(201).json({
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: true }
      });
    } catch (e) {
      // rollback the just-created user to avoid duplicate 409 on retry
      await User.deleteOne({ _id: user._id });
      throw e;
    }
  } catch (err) {
    next(err);
  }
});

export default router;
