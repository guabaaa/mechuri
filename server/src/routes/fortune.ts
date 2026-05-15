import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';
import {
  buildFortuneFromBirthday,
  parseBirthday,
} from '../services/fortuneService';

const router = Router();

const bodySchema = z.object({
  birthday: z.string().min(8).max(32),
});

router.post('/', (req, res, next) => {
  try {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'birthday 필드가 필요합니다.');
    }
    const birthday = parseBirthday(parsed.data.birthday);
    const result = buildFortuneFromBirthday(birthday);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

export default router;
