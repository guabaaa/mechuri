import { getKeyHashAndroid } from '@react-native-kakao/core';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import NaverLogin from '@react-native-seoul/naver-login';
import { Platform } from 'react-native';
import { authConfig } from '../config/auth';
import { ensureKakaoInitialized } from './kakaoAuth';

let initialized = false;
let initPromise: Promise<void> | null = null;

export function initAuthSdks(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    if (initialized) {
      return;
    }

    const { kakao, naver, google } = authConfig;

    if (kakao.nativeAppKey?.trim()) {
      await ensureKakaoInitialized();
      if (__DEV__) {
        console.log('[Mechuri] Kakao SDK ready');
      }
      if (__DEV__ && Platform.OS === 'android') {
        getKeyHashAndroid()
          .then((hash) => {
            if (hash) {
              console.log(
                '[Mechuri] Kakao Android key hash (콘솔에 등록):',
                hash,
              );
            }
          })
          .catch(() => {
            /* ignore */
          });
      }
    }

    if (naver.consumerKey && naver.consumerSecret) {
      NaverLogin.initialize({
        appName: naver.appName,
        consumerKey: naver.consumerKey,
        consumerSecret: naver.consumerSecret,
        disableNaverAppAuthIOS: naver.disableNaverAppAuthIOS,
        serviceUrlSchemeIOS: naver.urlScheme,
      });
      if (__DEV__) {
        console.log('[Mechuri] Naver Login SDK initialized');
      }
    } else if (__DEV__) {
      console.log(
        '[Mechuri] Naver Login: auth.local.ts 에 consumerKey/consumerSecret을 넣으세요.',
      );
    }

    if (google.webClientId) {
      GoogleSignin.configure({
        webClientId: google.webClientId,
        iosClientId: google.iosClientId || undefined,
        offlineAccess: false,
      });
    }

    initialized = true;
  })().catch((error) => {
    initPromise = null;
    throw error;
  });

  return initPromise;
}
