// api/routes/auth.js
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
    secure: true,      // set true in production (HTTPS)
    sameSite: 'lax',
    maxAge: REFRESH_TTL_MS,
    path: '/api/auth/refresh'
  });

// POST /api/auth/login — Admin login
// Body: { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordHash');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  // Enforce admin for admin portal
  if (!user.isAdmin) return res.status(403).json({ message: 'Admin access required' });

  const accessToken = jwt.sign(
    { sub: user._id, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );
  const refreshToken = jwt.sign(
    { sub: user._id, type: 'refresh', role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  setRefreshCookie(res, refreshToken);

  res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: !!user.isAdmin }
  });
});

export default router;
