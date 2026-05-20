import {
  launchCamera,
  launchImageLibrary,
  type CameraOptions,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import {
  ensureCameraPermission,
  ensurePhotoLibraryPermission,
  mealMediaPermissionMessage,
  type MealMediaKind,
} from './mealPhotoPermissions';

const baseOptions = {
  mediaType: 'photo' as const,
  quality: 0.8 as const,
  maxWidth: 1920,
  maxHeight: 1920,
  selectionLimit: 1,
};

export class MealPhotoPermissionError extends Error {
  readonly kind: MealMediaKind;

  readonly blocked: boolean;

  constructor(kind: MealMediaKind, blocked: boolean) {
    super(mealMediaPermissionMessage(kind, blocked));
    this.name = 'MealPhotoPermissionError';
    this.kind = kind;
    this.blocked = blocked;
  }
}

function assertPickerResult(
  kind: MealMediaKind,
  errorCode?: string,
  errorMessage?: string,
) {
  if (errorCode === 'permission') {
    throw new MealPhotoPermissionError(kind, true);
  }
  if (errorCode) {
    throw new Error(errorMessage ?? '사진을 불러오지 못했어요.');
  }
}

export async function pickMealPhotoFromLibrary(): Promise<string | null> {
  const permission = await ensurePhotoLibraryPermission();
  if (!permission.ok) {
    throw new MealPhotoPermissionError(permission.kind, permission.blocked);
  }

  const options: ImageLibraryOptions = baseOptions;
  const result = await launchImageLibrary(options);
  if (result.didCancel) {
    return null;
  }
  assertPickerResult('library', result.errorCode, result.errorMessage);
  return result.assets?.[0]?.uri ?? null;
}

export async function pickMealPhotoFromCamera(): Promise<string | null> {
  const permission = await ensureCameraPermission();
  if (!permission.ok) {
    throw new MealPhotoPermissionError(permission.kind, permission.blocked);
  }

  const options: CameraOptions = {
    ...baseOptions,
    saveToPhotos: false,
  };
  const result = await launchCamera(options);
  if (result.didCancel) {
    return null;
  }
  assertPickerResult('camera', result.errorCode, result.errorMessage);
  return result.assets?.[0]?.uri ?? null;
}
