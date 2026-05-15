import type { AuthProviderId } from '../api/types';

export type AuthConfig = {
  kakao: { nativeAppKey: string };
  naver: {
    consumerKey: string;
    consumerSecret: string;
    appName: string;
    urlScheme: string;
    disableNaverAppAuthIOS: boolean;
  };
  google: { webClientId: string; iosClientId: string };
};

const defaults: AuthConfig = {
  kakao: { nativeAppKey: '' },
  naver: {
    consumerKey: '',
    consumerSecret: '',
    appName: '메추리',
    urlScheme: 'mechurinaver',
    disableNaverAppAuthIOS: true,
  },
  google: { webClientId: '', iosClientId: '' },
};

function loadLocal(): Partial<AuthConfig> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('./auth.local') as { AUTH_CONFIG?: Partial<AuthConfig> };
    return mod.AUTH_CONFIG ?? null;
  } catch {
    return null;
  }
}

const local = loadLocal();

export const authConfig: AuthConfig = {
  kakao: { ...defaults.kakao, ...local?.kakao },
  naver: { ...defaults.naver, ...local?.naver },
  google: { ...defaults.google, ...local?.google },
};

export function isAuthProviderConfigured(provider: AuthProviderId) {
  if (provider === 'guest') {
    return true;
  }
  if (provider === 'kakao') {
    return Boolean(authConfig.kakao.nativeAppKey);
  }
  if (provider === 'naver') {
    return Boolean(
      authConfig.naver.consumerKey && authConfig.naver.consumerSecret,
    );
  }
  if (provider === 'google') {
    return Boolean(authConfig.google.webClientId);
  }
  if (provider === 'apple') {
    return true;
  }
  return false;
}

export function authSetupHint(provider: AuthProviderId) {
  const hints: Record<AuthProviderId, string> = {
    kakao: 'src/config/auth.local.ts 에 카카오 네이티브 앱 키를 넣어 주세요.',
    naver: 'src/config/auth.local.ts 에 네이버 Client ID/Secret을 넣어 주세요.',
    apple: 'iOS 실기기·시뮬레이터에서 Sign in with Apple capability를 켜 주세요.',
    google:
      'src/config/auth.local.ts 에 Google Web Client ID를 넣어 주세요.',
    guest: '',
  };
  return hints[provider];
}
