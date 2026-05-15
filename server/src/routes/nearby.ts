import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';
import { getNearbyDistricts, pickNearbyMenu } from '../services/nearbyService';

const router = Router();

router.get('/districts', (_req, res) => {
  res.json({ data: getNearbyDistricts() });
});

router.post('/pick', (req, res, next) => {
  try {
    const schema = z.object({
      districtId: z.string().min(1),
      radiusWalkMin: z.union([z.literal(5), z.literal(10), z.literal(15)]).optional(),
      mood: z.enum(['solo', 'team', 'light', 'hearty']).optional(),
      exclude: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '요청 형식이 올바르지 않습니다.');
    }

    const result = pickNearbyMenu({
      districtId: parsed.data.districtId,
      radiusWalkMin: parsed.data.radiusWalkMin,
      mood: parsed.data.mood,
      exclude: parsed.data.exclude,
    });

    if (!result) {
      throw new ApiError(404, 'NOT_FOUND', '동네를 찾을 수 없어요.');
    }

    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

export default router;
