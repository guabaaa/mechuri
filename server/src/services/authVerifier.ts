import { createRemoteJWKSet, jwtVerify } from 'jose';
import { getAuthEnv } from '../config/authEnv';
import { ApiError } from '../middleware/errorHandler';
import type { SocialProvider } from './authService';

export type VerifiedSocialUser = {
  provider: SocialProvider;
  providerUserId: string;
  nickname: string;
};

const appleJwks = createRemoteJWKSet(
  new URL('https://appleid.apple.com/auth/keys'),
);

async function verifyKakao(accessToken: string): Promise<VerifiedSocialUser> {
  const res = await fetch('https://kapi.kakao.com/v1/user/access_token_info', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new ApiError(401, 'INVALID_TOKEN', '카카오 토큰이 유효하지 않아요.');
  }
  const info = (await res.json()) as { id?: number };
  const meRes = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!meRes.ok) {
    throw new ApiError(401, 'INVALID_TOKEN', '카카오 사용자 정보를 가져오지 못했어요.');
  }
  const me = (await meRes.json()) as {
    id: number;
    kakao_account?: { profile?: { nickname?: string } };
  };
  const nickname =
    me.kakao_account?.profile?.nickname?.trim() || `카카오${info.id ?? me.id}`;
  return {
    provider: 'kakao',
    providerUserId: String(me.id),
    nickname,
  };
}

async function verifyNaver(accessToken: string): Promise<VerifiedSocialUser> {
  const res = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new ApiError(401, 'INVALID_TOKEN', '네이버 토큰이 유효하지 않아요.');
  }
  const body = (await res.json()) as {
    resultcode: string;
    message: string;
    response?: { id: string; nickname?: string; name?: string };
  };
  if (body.resultcode !== '00' || !body.response?.id) {
    throw new ApiError(401, 'INVALID_TOKEN', '네이버 사용자 정보를 가져오지 못했어요.');
  }
  const nickname =
    body.response.nickname?.trim() ||
    body.response.name?.trim() ||
    `네이버${body.response.id.slice(-4)}`;
  return {
    provider: 'naver',
    providerUserId: body.response.id,
    nickname,
  };
}

async function verifyGoogle(idToken: string): Promise<VerifiedSocialUser> {
  const url = new URL('https://oauth2.googleapis.com/tokeninfo');
  url.searchParams.set('id_token', idToken);
  const res = await fetch(url);
  if (!res.ok) {
    throw new ApiError(401, 'INVALID_TOKEN', 'Google idToken이 유효하지 않아요.');
  }
  const payload = (await res.json()) as {
    sub: string;
    name?: string;
    email?: string;
    aud?: string;
  };
  const { googleClientId } = getAuthEnv();
  if (googleClientId && payload.aud && payload.aud !== googleClientId) {
    throw new ApiError(401, 'INVALID_TOKEN', 'Google 클라이언트 ID가 일치하지 않아요.');
  }
  const nickname =
    payload.name?.trim() ||
    (payload.email ? payload.email.split('@')[0] : '') ||
    `Google${payload.sub.slice(-4)}`;
  return {
    provider: 'google',
    providerUserId: payload.sub,
    nickname,
  };
}

async function verifyApple(
  idToken: string,
  nonce?: string,
): Promise<VerifiedSocialUser> {
  const { appleBundleId } = getAuthEnv();
  const { payload } = await jwtVerify(idToken, appleJwks, {
    issuer: 'https://appleid.apple.com',
    audience: appleBundleId,
  });
  const sub = String(payload.sub ?? '');
  if (!sub) {
    throw new ApiError(401, 'INVALID_TOKEN', 'Apple idToken이 유효하지 않아요.');
  }
  if (nonce && payload.nonce !== nonce) {
    throw new ApiError(401, 'INVALID_TOKEN', 'Apple nonce가 일치하지 않아요.');
  }
  const email = typeof payload.email === 'string' ? payload.email : '';
  const nickname = email ? email.split('@')[0] : `Apple${sub.slice(-4)}`;
  return {
    provider: 'apple',
    providerUserId: sub,
    nickname,
  };
}

export async function verifySocialCredential(input: {
  provider: SocialProvider;
  accessToken?: string;
  idToken?: string;
  nonce?: string;
}): Promise<VerifiedSocialUser> {
  const { provider, accessToken, idToken, nonce } = input;

  if (provider === 'guest') {
    return {
      provider: 'guest',
      providerUserId: `guest_${Date.now()}`,
      nickname: `게스트${String(1000 + Math.floor(Math.random() * 9000))}`,
    };
  }

  if (getAuthEnv().skipVerify) {
    const suffix = String(1000 + Math.floor(Math.random() * 9000));
    return {
      provider,
      providerUserId: `${provider}_dev_${suffix}`,
      nickname: `${provider}${suffix}`,
    };
  }

  switch (provider) {
    case 'kakao':
      if (!accessToken) {
        throw new ApiError(400, 'VALIDATION_ERROR', '카카오 accessToken이 필요해요.');
      }
      return verifyKakao(accessToken);
    case 'naver':
      if (!accessToken) {
        throw new ApiError(400, 'VALIDATION_ERROR', '네이버 accessToken이 필요해요.');
      }
      return verifyNaver(accessToken);
    case 'google':
      if (!idToken) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Google idToken이 필요해요.');
      }
      return verifyGoogle(idToken);
    case 'apple':
      if (!idToken) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Apple idToken이 필요해요.');
      }
      return verifyApple(idToken, nonce);
    default:
      throw new ApiError(400, 'VALIDATION_ERROR', '지원하지 않는 로그인 방식이에요.');
  }
}
