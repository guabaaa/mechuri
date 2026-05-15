import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';
import {
  getResultByPersona,
  getWeeklyQuestions,
  resolveMbtiResult,
} from '../services/mbtiService';
import type { PersonaKey } from '../data/mevitiAI';

const router = Router();

/** GET /api/v1/mbti/questions — 이번 주 메비티아이 세트 반환 */
router.get('/questions', (_req, res) => {
  res.json({ data: getWeeklyQuestions() });
});

/** POST /api/v1/mbti/result — 답변 counts로 결과 계산 */
router.post('/result', (req, res, next) => {
  try {
    const schema = z.object({
      counts: z.record(z.string(), z.number().int().min(0)),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'counts 필드가 필요합니다.');
    }
    res.json({ data: resolveMbtiResult(parsed.data.counts) });
  } catch (e) {
    next(e);
  }
});

/** GET /api/v1/mbti/result/:personaKey — 특정 페르소나 결과 조회 */
router.get('/result/:personaKey', (req, res, next) => {
  try {
    const key = req.params.personaKey as PersonaKey;
    res.json({ data: getResultByPersona(key) });
  } catch (e) {
    next(e);
  }
});

export default router;
