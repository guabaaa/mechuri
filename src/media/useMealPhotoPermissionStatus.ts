import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  type Permission,
  type PermissionStatus,
} from 'react-native-permissions';
import {
  ensureCameraPermission,
  ensurePhotoLibraryPermission,
} from './mealPhotoPermissions';

export type MealPermissionState = {
  camera: PermissionStatus;
  library: PermissionStatus;
};

function libraryPermission(): Permission {
  if (Platform.OS === 'ios') {
    return PERMISSIONS.IOS.PHOTO_LIBRARY;
  }
  if (Number(Platform.Version) >= 33) {
    return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
  }
  return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
}

function cameraPermission(): Permission {
  return Platform.OS === 'ios'
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;
}

function isAllowed(status: PermissionStatus) {
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
}

export function useMealPhotoPermissionStatus() {
  const [state, setState] = useState<MealPermissionState | null>(null);

  const refresh = useCallback(async () => {
    const [camera, library] = await Promise.all([
      check(cameraPermission()),
      check(libraryPermission()),
    ]);
    setState({ camera, library });
    return { camera, library };
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const requestAll = useCallback(async () => {
    await ensurePhotoLibraryPermission();
    await ensureCameraPermission();
    return refresh();
  }, [refresh]);

  const allAllowed =
    state != null && isAllowed(state.camera) && isAllowed(state.library);

  const showSettings =
    state != null &&
    (state.camera === RESULTS.BLOCKED ||
      state.library === RESULTS.BLOCKED ||
      state.camera === RESULTS.UNAVAILABLE ||
      state.library === RESULTS.UNAVAILABLE);

  const showAllowButton = state != null && !allAllowed && !showSettings;

  return {
    state,
    refresh,
    requestAll,
    allAllowed,
    showSettings,
    showAllowButton,
  };
}
