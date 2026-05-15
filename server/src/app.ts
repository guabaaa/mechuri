import cors from 'cors';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import fortuneRouter from './routes/fortune';
import menusRouter from './routes/menus';
import mbtiRouter from './routes/mbti';
import nearbyRouter from './routes/nearby';
import recipesRouter from './routes/recipes';
import { formatTodayLabel } from './services/fortuneService';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, dateLabel: formatTodayLabel() });
  });

  app.use('/api/v1/fortune', fortuneRouter);
  app.use('/api/v1/menus', menusRouter);
  app.use('/api/v1/mbti', mbtiRouter);
  app.use('/api/v1/nearby', nearbyRouter);
  app.use('/api/v1/recipes', recipesRouter);

  app.use(errorHandler);

  return app;
}
