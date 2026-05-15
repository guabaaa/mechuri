/** 공통 메뉴 풀 — 이후 날씨·선호·가격대 등과 연결해 확장 */
export const ALL_MENUS = [
  '김치찌개',
  '된장찌개',
  '비빔밥',
  '삼겹살',
  '치킨',
  '냉면',
  '초밥',
  '라멘',
  '파스타',
  '햄버거',
  '샐러드',
  '마라탕',
  '짜장면',
  '짬뽕',
  '떡볶이',
  '순대국밥',
  '돼지국밥',
  '설렁탕',
  '콩국수',
  '회',
  '스테이크',
  '샌드위치',
  '닭갈비',
  '제육볶음',
  '카레',
  '계란덮밥',
  '돈까스',
  '불고기',
  '쌈밥',
  '순두부찌개',
] as const;

export type MenuName = (typeof ALL_MENUS)[number];

export function pickRandom<T extends string>(
  pool: readonly T[],
  exclude?: string,
): T {
  const list = exclude
    ? pool.filter((m) => m !== exclude)
    : [...pool];
  const arr = list.length > 0 ? list : [...pool];
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export const TODAY_MESSAGES = [
  '오늘은 든든한 한 끼로 에너지 충전이 필요한 날이에요.',
  '가볍게 먹고 싶은 기분이 들 수 있어요.',
  '조금 특별한 맛으로 기분 전환 어때요?',
  '바쁜 하루, 빠르게 만족할 수 있는 메뉴를 골랐어요.',
  '팀이랑 나눠 먹기 좋은 메뉴예요.',
];
