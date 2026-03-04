import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './server/auth';
import blogRoutes from './server/blogs';
import publicRoutes from './server/public';
import { logger } from './server/logger';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
  });

  // Apply rate limit to auth and public routes
  app.use('/api/auth', limiter);
  app.use('/api/public', limiter);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/public', publicRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
