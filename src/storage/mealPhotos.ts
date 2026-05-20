import ReactNativeBlobUtil from 'react-native-blob-util';

const PHOTOS_DIR = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/meal-photos`;

function sanitizeId(id: string) {
  return id.replace(/[^a-zA-Z0-9-_]/g, '_');
}

export async function ensureMealPhotosDir(): Promise<void> {
  const exists = await ReactNativeBlobUtil.fs.isDir(PHOTOS_DIR);
  if (!exists) {
    await ReactNativeBlobUtil.fs.mkdir(PHOTOS_DIR);
  }
}

export function mealPhotoFilePath(recordId: string): string {
  return `${PHOTOS_DIR}/${sanitizeId(recordId)}.jpg`;
}

export async function persistMealPhotoFromUri(
  sourceUri: string,
  recordId: string,
): Promise<string> {
  await ensureMealPhotosDir();
  const dest = mealPhotoFilePath(recordId);
  if (await ReactNativeBlobUtil.fs.exists(dest)) {
    await ReactNativeBlobUtil.fs.unlink(dest);
  }
  const normalized = sourceUri.replace(/^file:\/\//, '');
  await ReactNativeBlobUtil.fs.cp(normalized, dest);
  return `file://${dest}`;
}

export async function deleteMealPhotoFile(photoPath?: string): Promise<void> {
  if (!photoPath) {
    return;
  }
  const path = photoPath.replace(/^file:\/\//, '');
  if (await ReactNativeBlobUtil.fs.exists(path)) {
    await ReactNativeBlobUtil.fs.unlink(path);
  }
}
