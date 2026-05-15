import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';
import {
  getAllRecipeSummaries,
  lookupRecipe,
} from '../services/recipeService';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ data: getAllRecipeSummaries() });
});

router.get('/detail', (req, res, next) => {
  try {
    const schema = z.object({ menu: z.string().min(1) });
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '메뉴 이름이 필요해요.');
    }
    const recipe = lookupRecipe(parsed.data.menu);
    if (!recipe) {
      throw new ApiError(404, 'NOT_FOUND', '레시피를 찾을 수 없어요.');
    }
    res.json({ data: recipe });
  } catch (e) {
    next(e);
  }
});

export default router;
