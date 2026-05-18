import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';
import {
  getUserByToken,
  normalizeNickname,
  revokeToken,
  socialSignIn,
  submitUserConsents,
  toAuthUserResponse,
  updateUserNickname,
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

function bearerToken(req: { headers: { authorization?: string } }) {
  const header = req.headers.authorization ?? '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

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
        user: toAuthUserResponse(user),
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get('/me', (req, res, next) => {
  try {
    const token = bearerToken(req);
    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', '로그인이 필요해요.');
    }
    const user = getUserByToken(token);
    if (!user) {
      throw new ApiError(401, 'UNAUTHORIZED', '세션이 만료됐어요. 다시 로그인해 주세요.');
    }
    res.json({ data: toAuthUserResponse(user) });
  } catch (e) {
    next(e);
  }
});

router.patch('/profile', (req, res, next) => {
  try {
    const schema = z.object({
      nickname: z.string().min(1),
    });
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '닉네임을 입력해 주세요.');
    }
    const token = bearerToken(req);
    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', '로그인이 필요해요.');
    }
    let nickname: string;
    try {
      nickname = normalizeNickname(parsed.data.nickname);
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      if (code === 'NICKNAME_TOO_SHORT') {
        throw new ApiError(400, 'VALIDATION_ERROR', '닉네임은 2자 이상이에요.');
      }
      if (code === 'NICKNAME_TOO_LONG') {
        throw new ApiError(400, 'VALIDATION_ERROR', '닉네임은 12자까지 가능해요.');
      }
      throw e;
    }
    const user = updateUserNickname(token, nickname);
    if (!user) {
      throw new ApiError(401, 'UNAUTHORIZED', '세션이 만료됐어요. 다시 로그인해 주세요.');
    }
    res.json({ data: toAuthUserResponse(user) });
  } catch (e) {
    next(e);
  }
});

router.post('/consent', (req, res, next) => {
  try {
    const schema = z.object({
      terms: z.literal(true),
      privacy: z.literal(true),
      location: z.literal(true),
    });
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '필수 약관에 모두 동의해 주세요.');
    }
    const token = bearerToken(req);
    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', '로그인이 필요해요.');
    }
    const user = submitUserConsents(token);
    if (!user) {
      throw new ApiError(401, 'UNAUTHORIZED', '세션이 만료됐어요. 다시 로그인해 주세요.');
    }
    res.json({ data: user });
  } catch (e) {
    next(e);
  }
});

router.post('/logout', (req, res, next) => {
  try {
    const token = bearerToken(req);
    if (token) {
      revokeToken(token);
    }
    res.json({ data: { ok: true } });
  } catch (e) {
    next(e);
  }
});

export default router;
