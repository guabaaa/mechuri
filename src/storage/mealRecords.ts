import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteMealPhotoFile } from './mealPhotos';
import { toDateKey } from '../utils/date';

const STORAGE_KEY = 'mechuri-meal-records-v1';

export type MealMood = 'great' | 'good' | 'ok';

export type MealRecord = {
  id: string;
  date: string;
  menu: string;
  mood: MealMood;
  memo?: string;
  /** 기기 내 영구 경로 (file://) */
  photoPath?: string;
  /** 추후 S3/CDN URL */
  photoUrl?: string;
  createdAt: string;
};

type Store = {
  records: Record<string, MealRecord>;
};

async function readStore(): Promise<Store> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { records: {} };
    }
    const parsed = JSON.parse(raw) as Store;
    if (!parsed?.records || typeof parsed.records !== 'object') {
      return { records: {} };
    }
    return parsed;
  } catch {
    return { records: {} };
  }
}

async function writeStore(store: Store): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function loadMealRecords(): Promise<MealRecord[]> {
  const store = await readStore();
  return Object.values(store.records).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export async function getMealRecord(dateKey: string): Promise<MealRecord | null> {
  const store = await readStore();
  return store.records[dateKey] ?? null;
}

export async function getMealRecordForDate(date: Date): Promise<MealRecord | null> {
  return getMealRecord(toDateKey(date));
}

export async function saveMealRecord(input: {
  date: Date;
  menu: string;
  mood: MealMood;
  memo?: string;
  photoPath?: string;
  photoUrl?: string;
}): Promise<MealRecord> {
  const menu = input.menu.trim() || '오늘의 밥';
  if (!input.photoPath && !input.photoUrl) {
    throw new Error('밥 사진을 추가해 주세요.');
  }

  const dateKey = toDateKey(input.date);
  const store = await readStore();
  const existing = store.records[dateKey];
  const record: MealRecord = {
    id: existing?.id ?? `meal-${dateKey}-${Date.now()}`,
    date: dateKey,
    menu,
    mood: input.mood,
    memo: input.memo?.trim() || undefined,
    photoPath: input.photoPath ?? existing?.photoPath,
    photoUrl: input.photoUrl ?? existing?.photoUrl,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  store.records[dateKey] = record;
  await writeStore(store);
  return record;
}

export async function deleteMealRecord(dateKey: string): Promise<void> {
  const store = await readStore();
  const existing = store.records[dateKey];
  if (existing?.photoPath) {
    await deleteMealPhotoFile(existing.photoPath);
  }
  delete store.records[dateKey];
  await writeStore(store);
}

/** 스토리 뷰어용 이미지 URI */
export function mealRecordImageUri(record: MealRecord): string | undefined {
  return record.photoUrl ?? record.photoPath;
}

export function countMealStreak(records: MealRecord[], today = new Date()): number {
  const keys = new Set(records.map((r) => r.date));
  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  while (keys.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
