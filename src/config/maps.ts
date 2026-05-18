import { Platform } from 'react-native';

/**
 * Android Google Maps API 키 (maps.local.ts)
 * iOS는 Apple 지도를 사용하므로 키 없이 동작합니다.
 * Android는 maps_keys.xml 의 google_maps_key 도 동일 값으로 맞춰 주세요.
 */
let localMapsKey = '';
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('./maps.local') as { GOOGLE_MAPS_ANDROID_KEY?: string };
  localMapsKey = mod.GOOGLE_MAPS_ANDROID_KEY?.trim() ?? '';
} catch {
  localMapsKey = '';
}

export const GOOGLE_MAPS_ANDROID_KEY = localMapsKey;

/** Android에서 네이티브 MapView 사용 가능 여부 (키 없으면 카카오맵 링크 UI) */
export function canUseNativeMapView() {
  if (Platform.OS === 'ios') {
    return true;
  }
  return Boolean(GOOGLE_MAPS_ANDROID_KEY);
}

export function kakaoMapLink(lat: number, lng: number) {
  return `https://map.kakao.com/link/map/${lat},${lng}`;
}
