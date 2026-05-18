/**
 * auth.local.ts 로 복사 후 키 입력
 *
 * 카카오 로그인: 비즈니스 앱 등록 없이 일반 앱으로 가능.
 * 콘솔 — 플랫폼(iOS com.mechuri / Android com.mechuri+키해시),
 * Redirect URI kakao{NATIVE_APP_KEY}://oauth, 동의항목 닉네임 ON.
 *
 * - nativeAppKey: 네이티브 앱 키 (로그인)
 * - restApiKey: REST API 키 (근처 먹기·카카오 지도) ← 네이티브 키와 다름!
 */
export const AUTH_CONFIG = {
  kakao: {
    nativeAppKey: 'YOUR_KAKAO_NATIVE_APP_KEY',
    restApiKey: 'YOUR_KAKAO_REST_API_KEY',
  },
  naver: {
    consumerKey: '',
    consumerSecret: '',
    appName: '메추리',
    urlScheme: 'mechurinaver',
    disableNaverAppAuthIOS: true,
  },
  google: {
    webClientId: '',
    iosClientId: '',
  },
} as const;
