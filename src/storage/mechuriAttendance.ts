import AsyncStorage from '@react-native-async-storage/async-storage';
import { toDateKey } from '../utils/date';

const STORAGE_KEY = 'mechuri-attendance-v1';

export type MechuriStage = 'egg' | 'chick' | 'adult';

export type MechuriAttendanceState = {
  totalCheckIns: number;
  lastCheckInDate: string | null;
  checkInDates: string[];
};

export function getMechuriStage(totalCheckIns: number): MechuriStage {
  if (totalCheckIns <= 0) {
    return 'egg';
  }
  if (totalCheckIns < 7) {
    return 'chick';
  }
  return 'adult';
}

export function countAttendanceStreak(
  checkInDates: string[],
  today = new Date(),
): number {
  const keys = new Set(checkInDates);
  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  while (keys.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

async function readState(): Promise<MechuriAttendanceState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { totalCheckIns: 0, lastCheckInDate: null, checkInDates: [] };
    }
    const parsed = JSON.parse(raw) as MechuriAttendanceState;
    return {
      totalCheckIns: parsed.totalCheckIns ?? 0,
      lastCheckInDate: parsed.lastCheckInDate ?? null,
      checkInDates: Array.isArray(parsed.checkInDates)
        ? parsed.checkInDates
        : [],
    };
  } catch {
    return { totalCheckIns: 0, lastCheckInDate: null, checkInDates: [] };
  }
}

async function writeState(state: MechuriAttendanceState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function loadMechuriAttendance(): Promise<MechuriAttendanceState> {
  return readState();
}

export function isCheckedInToday(
  state: MechuriAttendanceState,
  today = new Date(),
): boolean {
  return state.lastCheckInDate === toDateKey(today);
}

export type CheckInResult = {
  state: MechuriAttendanceState;
  stage: MechuriStage;
  previousStage: MechuriStage;
  alreadyCheckedIn: boolean;
  justHatched: boolean;
  justEvolved: boolean;
  streak: number;
};

export async function checkInMechuri(today = new Date()): Promise<CheckInResult> {
  const todayKey = toDateKey(today);
  const prev = await readState();
  const previousStage = getMechuriStage(prev.totalCheckIns);

  if (prev.lastCheckInDate === todayKey) {
    return {
      state: prev,
      stage: getMechuriStage(prev.totalCheckIns),
      previousStage,
      alreadyCheckedIn: true,
      justHatched: false,
      justEvolved: false,
      streak: countAttendanceStreak(prev.checkInDates, today),
    };
  }

  const dates = prev.checkInDates.includes(todayKey)
    ? prev.checkInDates
    : [...prev.checkInDates, todayKey].sort();

  const next: MechuriAttendanceState = {
    totalCheckIns: prev.totalCheckIns + 1,
    lastCheckInDate: todayKey,
    checkInDates: dates,
  };

  await writeState(next);

  const stage = getMechuriStage(next.totalCheckIns);
  const justHatched = previousStage === 'egg' && stage === 'chick';
  const justEvolved = previousStage === 'chick' && stage === 'adult';

  return {
    state: next,
    stage,
    previousStage,
    alreadyCheckedIn: false,
    justHatched,
    justEvolved,
    streak: countAttendanceStreak(dates, today),
  };
}

export const STAGE_LABELS: Record<MechuriStage, string> = {
  egg: '알 속 메추리',
  chick: '병아리 메추리',
  adult: '다 큰 메추리',
};

export const STAGE_HINTS: Record<MechuriStage, string> = {
  egg: '출석체크하면 알에서 깨어나요',
  chick: '7번 출석하면 어른 메추리로 자라요',
  adult: '매일 출석하고 점심도 기록해 보세요',
};
