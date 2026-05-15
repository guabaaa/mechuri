import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'mechuri-ladder-menus-v1';

export const DEFAULT_LADDER_MENUS = [
  '치킨',
  '피자',
  '라면',
  '햄버거',
  '떡볶이',
  '초밥',
];

export async function loadLadderMenus(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [...DEFAULT_LADDER_MENUS];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [...DEFAULT_LADDER_MENUS];
    }
    const list = parsed
      .filter((x): x is string => typeof x === 'string')
      .map((s) => s.trim())
      .filter(Boolean);
    return list.length >= 2 ? list : [...DEFAULT_LADDER_MENUS];
  } catch {
    return [...DEFAULT_LADDER_MENUS];
  }
}

export async function saveLadderMenus(menus: string[]): Promise<void> {
  const cleaned = menus.map((s) => s.trim()).filter(Boolean);
  if (cleaned.length < 2) {
    throw new Error('메뉴는 2개 이상 저장해야 해요.');
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
}
