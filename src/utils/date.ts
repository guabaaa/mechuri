const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function parseBirthdayInput(input: string): Date | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length !== 8) {
    return null;
  }
  const y = Number(digits.slice(0, 4));
  const m = Number(digits.slice(4, 6));
  const d = Number(digits.slice(6, 8));
  if (m < 1 || m > 12 || d < 1 || d > 31) {
    return null;
  }
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  const now = new Date();
  if (date > now || y < 1920) {
    return null;
  }
  return date;
}

export function formatBirthdayInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${d}.`;
}

export function formatTodayLabel(today: Date = new Date()): string {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const day = today.getDate();
  const w = WEEKDAYS[today.getDay()];
  return `${y}년 ${m}월 ${day}일 ${w}요일`;
}

/** API 요청용 ISO 날짜 (YYYY-MM-DD) */
export function toBirthdayPayload(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
