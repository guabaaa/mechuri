/** Phase 1: 동네 선택 기반 (GPS 없음) */

export const WALK_RADIUS = [5, 10, 15] as const;
export type WalkRadiusMin = (typeof WALK_RADIUS)[number];

export type NearbyMood = 'solo' | 'team' | 'light' | 'hearty';

export const DISTRICTS = [
  { id: 'gangnam', label: '강남·역삼', areaType: 'office' as const },
  { id: 'jongno', label: '종로·을지로', areaType: 'office' as const },
  { id: 'hongdae', label: '홍대·합정', areaType: 'mixed' as const },
  { id: 'jamsil', label: '잠실·송파', areaType: 'mixed' as const },
  { id: 'yeouido', label: '여의도', areaType: 'office' as const },
  { id: 'suwon', label: '수원역', areaType: 'station' as const },
] as const;

export type AreaType = 'office' | 'station' | 'mixed';

export const NEARBY_MENUS: Record<AreaType, readonly string[]> = {
  office: [
    '김치찌개',
    '된장찌개',
    '비빔밥',
    '돈까스',
    '칼국수',
    '냉면',
    '초밥',
    '분식',
    '샐러드',
    '쌀국수',
  ],
  station: [
    '분식',
    '김밥',
    '라면',
    '치킨',
    '햄버거',
    '떡볶이',
    '우동',
    '토스트',
    '샌드위치',
    '컵밥',
  ],
  mixed: [
    '파스타',
    '피자',
    '마라탕',
    '삼겹살',
    '치킨',
    '초밥',
    '떡볶이',
    '샤브샤브',
    '곱창',
    '버거',
  ],
};

export const MOOD_MENU_BOOST: Record<NearbyMood, readonly string[]> = {
  solo: ['비빔밥', '돈까스', '쌀국수', '라면', '초밥', '샐러드'],
  team: ['삼겹살', '치킨', '마라탕', '피자', '곱창', '샤브샤브'],
  light: ['샐러드', '쌀국수', '샌드위치', '초밥', '분식', '컵밥'],
  hearty: ['김치찌개', '돈까스', '삼겹살', '칼국수', '된장찌개', '버거'],
};

export const NEARBY_MESSAGES = [
  '도보 거리면 딱 좋은 한 끼예요.',
  '근처에서 자주 가는 맛집 느낌이에요.',
  '오늘 점심, 여기서 해결해 보세요!',
  '메추리가 발로 터벅터벅 다녀본 것 같아요.',
  '이 동네면 이 메뉴, 무난하게 잘 어울려요.',
];

const PLACE_PREFIX: Record<AreaType, string[]> = {
  office: ['역삼', '테헤란로', '점심골목', '사무실앞'],
  station: ['역앞', '지하상가', '출구 앞', '광장'],
  mixed: ['골목', '메인거리', '광장', '로데오'],
};

const PLACE_SUFFIX = [
  '식당',
  '분식',
  '한식',
  '일식',
  '덮밥',
  '국밥',
  '면가',
  '키친',
];

export function seedPlaces(
  areaType: AreaType,
  districtLabel: string,
  menu: string,
  walkMin: number,
  count = 3,
): { name: string; category: string; walkMin: number }[] {
  const prefixes = PLACE_PREFIX[areaType];
  const category = menu.includes('면')
    ? '면요리'
    : menu.includes('밥')
      ? '한식'
      : menu.includes('치킨')
        ? '치킨'
        : '식당';

  return Array.from({ length: count }, (_, i) => {
    const prefix = prefixes[i % prefixes.length]!;
    const suffix = PLACE_SUFFIX[i % PLACE_SUFFIX.length]!;
    return {
      name: `${districtLabel} ${prefix} ${suffix}`,
      category,
      walkMin: Math.max(2, walkMin - i),
    };
  });
}
