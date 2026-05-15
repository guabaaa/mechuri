import { Platform } from 'react-native';

/**
 * 개발 시 API 서버 주소
 * - iOS 시뮬레이터: localhost
 * - Android 에뮬레이터: 10.0.2.2
 * - 실제 기기: 맥 IP로 `src/config/api.local.ts` 생성 (gitignore)
 */
let localOverride: string | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  localOverride = require('./api.local').API_HOST as string | undefined;
} catch {
  localOverride = undefined;
}

const DEV_HOST =
  localOverride ??
  (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:3001`
  : 'https://api.mechuri.app';
