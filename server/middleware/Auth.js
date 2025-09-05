// api/middleware/auth.js
import jwt from 'jsonwebtoken';

export const verifyAccess = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.role = payload.role;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};
