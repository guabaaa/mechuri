import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mechuri/recent-districts-v1';
const MAX_RECENT = 3;

export async function loadRecentDistrictIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

export async function saveRecentDistrictId(districtId: string): Promise<void> {
  const prev = await loadRecentDistrictIds();
  const next = [districtId, ...prev.filter((id) => id !== districtId)].slice(
    0,
    MAX_RECENT,
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
