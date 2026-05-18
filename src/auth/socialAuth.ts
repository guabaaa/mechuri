import { Platform } from 'react-native';
import NaverLogin from '@react-native-seoul/naver-login';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import type { AuthProviderId } from '../api/types';
import { authConfig, authSetupHint, isAuthProviderConfigured } from '../config/auth';
import { signInWithKakao, signOutKakao } from './kakaoAuth';
import { initAuthSdks } from './initAuth';
import { SocialAuthError } from './SocialAuthError';
import type { SocialCredential } from './types';

function ensureNaverInitialized() {
  const n = authConfig.naver;
  if (!n.consumerKey || !n.consumerSecret) {
    throw new SocialAuthError(
      'NOT_CONFIGURED',
      authSetupHint('naver') || '네이버 로그인 설정이 필요해요.',
    );
  }
  NaverLogin.initialize({
    appName: n.appName,
    consumerKey: n.consumerKey,
    consumerSecret: n.consumerSecret,
    disableNaverAppAuthIOS: n.disableNaverAppAuthIOS,
    serviceUrlSchemeIOS: n.urlScheme,
  });
}

async function signInNaver(): Promise<SocialCredential> {
  ensureNaverInitialized();
  const result = await NaverLogin.login();
  if (!result.isSuccess || !result.successResponse?.accessToken) {
    if (result.failureResponse?.isCancel) {
      throw new SocialAuthError('CANCELLED', '로그인을 취소했어요.');
    }
    throw new SocialAuthError(
      'FAILED',
      result.failureResponse?.message ?? '네이버 로그인에 실패했어요.',
    );
  }
  return {
    provider: 'naver',
    accessToken: result.successResponse.accessToken,
  };
}

async function signInGoogle(): Promise<SocialCredential> {
  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
  }
  const response = await GoogleSignin.signIn();
  if (isCancelledResponse(response)) {
    throw new SocialAuthError('CANCELLED', '로그인을 취소했어요.');
  }
  const tokens = await GoogleSignin.getTokens();
  if (!tokens.idToken) {
    throw new SocialAuthError('FAILED', 'Google idToken을 받지 못했어요.');
  }
  return {
    provider: 'google',
    idToken: tokens.idToken,
    accessToken: tokens.accessToken,
  };
}

async function signInApple(): Promise<SocialCredential> {
  if (Platform.OS !== 'ios') {
    throw new SocialAuthError(
      'UNSUPPORTED',
      'Apple 로그인은 iOS에서만 사용할 수 있어요.',
    );
  }
  if (!appleAuth.isSupported) {
    throw new SocialAuthError(
      'UNSUPPORTED',
      '이 기기에서는 Sign in with Apple을 지원하지 않아요.',
    );
  }
  const result = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  if (!result.identityToken) {
    throw new SocialAuthError('FAILED', 'Apple identityToken을 받지 못했어요.');
  }
  return {
    provider: 'apple',
    idToken: result.identityToken,
    nonce: result.nonce,
  };
}

export async function obtainSocialCredential(
  provider: AuthProviderId,
): Promise<SocialCredential> {
  if (provider === 'guest') {
    return { provider: 'guest' };
  }

  if (!isAuthProviderConfigured(provider)) {
    throw new SocialAuthError(
      'NOT_CONFIGURED',
      authSetupHint(provider) || '로그인 설정이 필요해요.',
    );
  }

  try {
    await initAuthSdks();
    switch (provider) {
      case 'kakao':
        return await signInWithKakao();
      case 'naver':
        return await signInNaver();
      case 'google':
        return await signInGoogle();
      case 'apple':
        return await signInApple();
      default:
        throw new SocialAuthError('FAILED', '지원하지 않는 로그인 방식이에요.');
    }
  } catch (error) {
    if (error instanceof SocialAuthError) {
      throw error;
    }
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new SocialAuthError('CANCELLED', '로그인을 취소했어요.');
      }
    }
    const message =
      error instanceof Error ? error.message : '소셜 로그인에 실패했어요.';
    throw new SocialAuthError('FAILED', message);
  }
}

export async function signOutSocialSdks(provider: AuthProviderId) {
  try {
    if (provider === 'kakao') {
      await signOutKakao();
    }
    if (provider === 'naver' && authConfig.naver.consumerKey) {
      await NaverLogin.logout();
    }
    if (provider === 'google' && authConfig.google.webClientId) {
      await GoogleSignin.signOut();
    }
  } catch {
    /* ignore */
  }
}
