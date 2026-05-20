import { Linking, Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
  type Permission,
} from 'react-native-permissions';

export type MealMediaKind = 'camera' | 'library';

export type MealMediaPermissionResult =
  | { ok: true }
  | { ok: false; kind: MealMediaKind; blocked: boolean };

async function ensure(permission: Permission): Promise<{
  granted: boolean;
  blocked: boolean;
}> {
  const current = await check(permission);
  if (current === RESULTS.GRANTED || current === RESULTS.LIMITED) {
    return { granted: true, blocked: false };
  }
  if (current === RESULTS.BLOCKED || current === RESULTS.UNAVAILABLE) {
    return { granted: false, blocked: true };
  }
  const next = await request(permission);
  if (next === RESULTS.GRANTED || next === RESULTS.LIMITED) {
    return { granted: true, blocked: false };
  }
  const blocked = next === RESULTS.BLOCKED || next === RESULTS.UNAVAILABLE;
  return { granted: false, blocked };
}

export async function ensureCameraPermission(): Promise<MealMediaPermissionResult> {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
  const result = await ensure(permission);
  if (result.granted) {
    return { ok: true };
  }
  return { ok: false, kind: 'camera', blocked: result.blocked };
}

export async function ensurePhotoLibraryPermission(): Promise<MealMediaPermissionResult> {
  if (Platform.OS === 'ios') {
    const result = await ensure(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (result.granted) {
      return { ok: true };
    }
    return { ok: false, kind: 'library', blocked: result.blocked };
  }
  if (Number(Platform.Version) >= 33) {
    const result = await ensure(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    if (result.granted) {
      return { ok: true };
    }
    return { ok: false, kind: 'library', blocked: result.blocked };
  }
  const result = await ensure(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  if (result.granted) {
    return { ok: true };
  }
  return { ok: false, kind: 'library', blocked: result.blocked };
}

export function openMealPhotoSettings(): void {
  Linking.openSettings();
}

export function mealMediaPermissionMessage(
  kind: MealMediaKind,
  blocked: boolean,
): string {
  if (kind === 'camera') {
    return blocked
      ? '카메라 접근이 꺼져 있어요. 설정에서 허용해 주세요.'
      : '밥 사진을 찍으려면 카메라 권한이 필요해요.';
  }
  return blocked
    ? '사진 보관함 접근이 꺼져 있어요. 설정에서 허용해 주세요.'
    : '갤러리에서 사진을 고르려면 접근 권한이 필요해요.';
}
