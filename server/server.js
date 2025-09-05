import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import productsRoutes from './routes/Products.Routes.js';
import classesRoutes from './routes/Classes.Routes.js';
import authRoutes from './routes/Auth.js';
import adminAuthRoutes from './routes/Auth.Admin.js';
import galleryRoutes from './routes/Gallery.Routes.js';
import ordersRoutes from './routes/Orders.Routes.js';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET not set');
}
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI not set');
}

const app = express();

// If behind a reverse proxy (Heroku/Render/Nginx), trust it so req.ip is correct for rate limiting
if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

// CORS for credentialed requests: must return explicit origin, not '*'
const allowlist = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const corsOptions = {
  origin(origin, cb) {
    // Allow same-origin or tools (like curl/postman with no Origin)
    if (!origin) return cb(null, true);
    if (allowlist.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};
app.use(cors(corsOptions));
// Handle preflight for all routes
app.options('*', cors(corsOptions));

// Helmet: keep cross-origin resource/embedder policy compatible with external assets (Cloudinary, CDN)
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic rate limiting on API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Optional static uploads (not used with Cloudinary)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', adminAuthRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/orders', ordersRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// Error handler: surface validation errors as 400 for the admin UI
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status =
    err.statusCode ||
    (err.name === 'ValidationError' ? 400 : 500);
  const payload = { message: err.message || 'Server error' };

  if (err.name === 'ValidationError' && err.errors) {
    payload.details = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, v.message])
    );
  }
  // CORS errors from our origin callback
  if (/CORS blocked/.test(err.message)) {
    return res.status(403).json({ message: err.message });
  }
  res.status(status).json(payload);
});

// Startup
const PORT = process.env.PORT || 4000;
const start = async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
};
start();
