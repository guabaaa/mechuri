import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';
import {
  getUserByToken,
  revokeToken,
  socialSignIn,
  type SocialProvider,
} from '../services/authService';

const router = Router();

const providerSchema = z.enum(['kakao', 'naver', 'apple', 'google', 'guest']);

const socialBodySchema = z.object({
  provider: providerSchema,
  accessToken: z.string().min(1).optional(),
  idToken: z.string().min(1).optional(),
  nonce: z.string().optional(),
});

router.post('/social', async (req, res, next) => {
  try {
    const parsed = socialBodySchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '로그인 정보가 올바르지 않아요.');
    }
    const { provider, accessToken, idToken, nonce } = parsed.data;
    const { token, user } = await socialSignIn({
      provider: provider as SocialProvider,
      accessToken,
      idToken,
      nonce,
    });
    res.json({
      data: {
        token,
        user: {
          id: user.id,
          provider: user.provider,
          nickname: user.nickname,
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get('/me', (req, res, next) => {
  try {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', '로그인이 필요해요.');
    }
    const user = getUserByToken(token);
    if (!user) {
      throw new ApiError(401, 'UNAUTHORIZED', '세션이 만료됐어요. 다시 로그인해 주세요.');
    }
    res.json({
      data: {
        id: user.id,
        provider: user.provider,
        nickname: user.nickname,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.post('/logout', (req, res, next) => {
  try {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (token) {
      revokeToken(token);
    }
    res.json({ data: { ok: true } });
  } catch (e) {
    next(e);
  }
});

export default router;
