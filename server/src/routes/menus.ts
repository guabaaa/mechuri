import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';
import {
  getMenuPool,
  getSituations,
  pickSituationMenu,
  pickDeliveryMenu,
  pickTodayMenu,
  spinRoulette,
} from '../services/menuService';

const router = Router();

router.get('/pool', (_req, res) => {
  res.json({ data: getMenuPool() });
});

router.get('/situations', (_req, res) => {
  res.json({ data: getSituations() });
});

router.post('/situation', (req, res, next) => {
  try {
    const schema = z.object({ situationId: z.string().min(1) });
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '요청 형식이 올바르지 않습니다.');
    }
    const result = pickSituationMenu(parsed.data.situationId);
    if (!result) {
      throw new ApiError(404, 'NOT_FOUND', '상황을 찾을 수 없어요.');
    }
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

router.post('/delivery', (req, res, next) => {
  try {
    const schema = z.object({ exclude: z.string().optional() });
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '요청 형식이 올바르지 않습니다.');
    }
    res.json({ data: pickDeliveryMenu(parsed.data.exclude) });
  } catch (e) {
    next(e);
  }
});

router.post('/today', (req, res, next) => {
  try {
    const schema = z.object({ exclude: z.string().optional() });
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '요청 형식이 올바르지 않습니다.');
    }
    res.json({ data: pickTodayMenu(parsed.data.exclude) });
  } catch (e) {
    next(e);
  }
});

router.post('/roulette', (req, res, next) => {
  try {
    const schema = z.object({ excluded: z.array(z.string()).optional() });
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '요청 형식이 올바르지 않습니다.');
    }
    res.json({ data: spinRoulette(parsed.data.excluded ?? []) });
  } catch (e) {
    next(e);
  }
});

export default router;
