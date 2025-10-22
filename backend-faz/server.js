// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

// Routes
import adminPortalLoginRoutes from './routes/AdminPortalLoginRoutes.js';
import clubsAdminPortalLoginRoutes from './routes/Clubs-Management-Panel/Clubs-AdminPortalLoginRoutes.js';

import clubAppRoutes from './routes/frontend/ClubRegistration/ApplyClubAccountRoutes.js';

dotenv.config();
await connectDB();

const app = express();

// Security
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
if (process.env.NODE_ENV === 'production') {
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
}
app.set('trust proxy', 1);

// CORS
const baseProd = process.env.FRONTEND_URL || 'https://autonomyzambia.online';
const baseDev  = process.env.FRONTEND_URL_DEV || 'http://localhost:5173';
const localDefaults = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];
const extra = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([baseProd, baseDev, ...localDefaults, ...extra])).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ❌ REMOVE this — it’s causing the crash in Express 5
// app.options('/:path(.*)', cors());

// Parsers
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());

// Rate limit (public only, optional)
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(['/api/frontend', '/api/public'], publicLimiter);

// Routes
app.use('/api/settings', adminPortalLoginRoutes);
app.use('/api/clubs-panel', clubsAdminPortalLoginRoutes);
// Club Applications API
app.use('/api/club-applications', clubAppRoutes);

// Health
app.get('/health', (_req, res) => res.send('ok'));

// Error handler
app.use((err, _req, res, _next) => {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: '❌ File too large. Max size is 30MB per file.' });
  }
  console.error('❌ Error:', err?.message || err);
  res.status(500).json({ status: 'error', message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
