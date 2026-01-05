// server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

// Routes
import adminPortalLoginRoutes from './routes/AdminPortalLoginRoutes.js';
import clubsAdminPortalLoginRoutes from './routes/Clubs-Management-Panel/Clubs-AdminPortalLoginRoutes.js';
import clubAppRoutes from './routes/frontend/ClubRegistration/ApplyClubAccountRoutes.js';
import playersRoutes from './routes/club/PlayersRoutes.js';
import publicPlayersRoutes from './routes/frontend/PublicPlayersRoutes.js';
import transfersRoutes from './routes/club/TransfersRoutes.js';
import matchesRoutes from './routes/MatchesRoutes.js';
import clubsRoutes from './routes/ClubsRoutes.js';
import adminPlayersRoutes from './routes/admin/PlayersAdminRoutes.js';
import adminTransfersRoutes from './routes/admin/TransfersAdminRoutes.js';
import adminFifaRoutes from './routes/admin/FifaWebhooksRoutes.js';
import contentRoutes from './routes/ContentRoutes.js';

// Conditionally start transfer exporter worker. Use dynamic import so missing deps
// (e.g., bullmq) don't prevent the server from starting during local testing.
if (process.env.DISABLE_TRANSFER_WORKER === '1' || process.env.DISABLE_TRANSFER_WORKER === 'true') {
  console.log('ℹ️ Transfer worker disabled by DISABLE_TRANSFER_WORKER');
} else {
  try {
    // dynamic import to avoid module resolution errors when bullmq is not installed
    const mod = await import('./jobs/transferExporter.js');
    // module starts worker on import; if it exports a startup fn we could call it here
    console.log('ℹ️ Transfer exporter module loaded');
  } catch (err) {
    console.warn('⚠️ Transfer exporter not started (missing optional deps):', err?.message || err);
  }
} 

// Load .env from the same directory as this file to avoid cwd issues when running nodemon
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
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
  'http://localhost:8080',
];
const extra = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([baseProd, baseDev, ...localDefaults, ...extra])).filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Global preflight handler (avoid using a wildcard route which breaks path-to-regexp)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return cors(corsOptions)(req, res, () => res.sendStatus(204));
  }
  next();
});

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
// Club Dashboard APIs
app.use('/api/players', playersRoutes);
// Public players listing for scouting / frontend market
app.use('/api/public/players', publicPlayersRoutes);
app.use('/api/transfers', transfersRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/clubs', clubsRoutes);

// Admin namespaces (Super Admin actions: approvals, oversight)
app.use('/api/admin/players', adminPlayersRoutes);
app.use('/api/admin/transfers', adminTransfersRoutes);
app.use('/api/admin/fifa-webhooks', adminFifaRoutes);

// Content API
app.use('/api/content', contentRoutes);

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

// Export app for testing; only listen when not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

export default app;
