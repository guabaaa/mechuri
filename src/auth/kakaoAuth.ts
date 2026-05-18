import { initializeKakaoSDK } from '@react-native-kakao/core';
import {
  isKakaoTalkLoginAvailable,
  login as kakaoLogin,
  logout as kakaoLogout,
} from '@react-native-kakao/user';
import { authConfig, authSetupHint } from '../config/auth';
import { SocialAuthError } from './SocialAuthError';
import type { SocialCredential } from './types';

let kakaoInitPromise: Promise<void> | null = null;

export function resetKakaoInit() {
  kakaoInitPromise = null;
}

export function ensureKakaoInitialized(): Promise<void> {
  const key = authConfig.kakao.nativeAppKey?.trim();
  if (!key) {
    return Promise.reject(
      new SocialAuthError(
        'NOT_CONFIGURED',
        authSetupHint('kakao') || '카카오 로그인 설정이 필요해요.',
      ),
    );
  }
  if (!kakaoInitPromise) {
    kakaoInitPromise = initializeKakaoSDK(key).catch((error) => {
      kakaoInitPromise = null;
      throw error;
    });
  }
  return kakaoInitPromise;
}

function mapKakaoNativeError(error: unknown): SocialAuthError {
  const message =
    error instanceof Error ? error.message : String(error ?? '카카오 로그인 실패');

  if (/cancel/i.test(message)) {
    return new SocialAuthError('CANCELLED', '로그인을 취소했어요.');
  }
  if (/KOE101|appKey|app.?key|invalid.*key/i.test(message)) {
    return new SocialAuthError(
      'FAILED',
      '카카오 앱 키가 올바르지 않아요. auth.local.ts · auth_keys.xml · Info.plist 를 확인해 주세요.',
    );
  }
  if (/bundle|redirect|scheme|uri|misconfigured/i.test(message)) {
    return new SocialAuthError(
      'FAILED',
      '카카오 개발자 콘솔에 앱을 등록해 주세요.\n· iOS 번들 ID: com.mechuri\n· Android: com.mechuri\n· iOS URL: kakao{네이티브앱키}',
    );
  }
  return new SocialAuthError('FAILED', message);
}

async function runKakaoLogin(useKakaoAccountLogin: boolean) {
  const result = await kakaoLogin({ useKakaoAccountLogin });
  if (!result.accessToken) {
    throw new SocialAuthError('FAILED', '카카오 accessToken을 받지 못했어요.');
  }
  return { provider: 'kakao' as const, accessToken: result.accessToken };
}

export async function signInWithKakao(): Promise<SocialCredential> {
  try {
    await ensureKakaoInitialized();

    let useKakaoAccountLogin = true;
    if (!__DEV__) {
      try {
        useKakaoAccountLogin = !(await isKakaoTalkLoginAvailable());
      } catch {
        useKakaoAccountLogin = true;
      }
    }

    try {
      return await runKakaoLogin(useKakaoAccountLogin);
    } catch (firstError) {
      if (firstError instanceof SocialAuthError && firstError.code === 'CANCELLED') {
        throw firstError;
      }
      try {
        return await runKakaoLogin(!useKakaoAccountLogin);
      } catch {
        throw mapKakaoNativeError(firstError);
      }
    }
  } catch (error) {
    if (error instanceof SocialAuthError) {
      throw error;
    }
    throw mapKakaoNativeError(error);
  }
}

export async function signOutKakao() {
  if (!authConfig.kakao.nativeAppKey) {
    return;
  }
  try {
    await kakaoLogout();
  } catch {
    /* ignore */
  }
}
