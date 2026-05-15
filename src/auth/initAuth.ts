import { initializeKakaoSDK } from '@react-native-kakao/core';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import NaverLogin from '@react-native-seoul/naver-login';
import { authConfig } from '../config/auth';

let initialized = false;

export async function initAuthSdks() {
  if (initialized) {
    return;
  }

  const { kakao, naver, google } = authConfig;

  if (kakao.nativeAppKey) {
    await initializeKakaoSDK(kakao.nativeAppKey);
  }

  if (naver.consumerKey && naver.consumerSecret) {
    NaverLogin.initialize({
      appName: naver.appName,
      consumerKey: naver.consumerKey,
      consumerSecret: naver.consumerSecret,
      disableNaverAppAuthIOS: naver.disableNaverAppAuthIOS,
      serviceUrlSchemeIOS: naver.urlScheme,
    });
  }

  if (google.webClientId) {
    GoogleSignin.configure({
      webClientId: google.webClientId,
      iosClientId: google.iosClientId || undefined,
      offlineAccess: false,
    });
  }

  initialized = true;
}
