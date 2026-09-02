import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './routes/api';
import { checkConnection } from './config/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API ${req.method}] ${req.url}`);
  }
  next();
});

// Mount API routes
app.use('/api', apiRouter);

// Serve static frontend assets in production if built
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA client-side routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) next();
    });
  }
  next();
});

// Global 404 handler for API
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global Error Handler Middleware (prevents leaking SQL/stack traces)
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const isDev = process.env.NODE_ENV === 'development';
  console.error(`[Server Error] ${req.method} ${req.url}:`, err.message || err);
  res.status(err.status || 500).json({
    success: false,
    error: isDev ? (err.message || 'Server error') : 'An internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 TravelRescue Backend Server listening on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`🌐 Allowed Frontend: ${FRONTEND_URL}`);
  
  const dbCheck = await checkConnection();
  if (dbCheck.connected) {
    console.log(`🟢 PostgreSQL 18 Database: CONNECTED (travelrescue_db)`);
  } else {
    console.warn(`🔴 PostgreSQL Database: DISCONNECTED (${dbCheck.error})`);
  }
  console.log(`====================================================`);
});
