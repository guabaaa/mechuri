import {
  MOOD_MENU_BOOST,
  NEARBY_MESSAGES,
  NEARBY_MENUS,
  type NearbyMood,
  type WalkRadiusMin,
} from '../data/nearby';

const DEV_PLACE_NAMES = ['근처 한식당', '골목 식당', '역세권 맛집'] as const;

function pickRandom<T>(pool: readonly T[], exclude?: string): T {
  const list = exclude ? pool.filter((m) => m !== exclude) : [...pool];
  const arr = list.length > 0 ? list : [...pool];
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function pickNearbyAtLocationDevFallback(params: {
  lat: number;
  lng: number;
  radiusWalkMin?: WalkRadiusMin;
  mood?: NearbyMood;
  exclude?: string;
}) {
  const walkMin = params.radiusWalkMin ?? 10;
  const pool = params.mood
    ? [...MOOD_MENU_BOOST[params.mood], ...NEARBY_MENUS.mixed]
    : [...NEARBY_MENUS.mixed];
  const menu = pickRandom(pool, params.exclude);
  const message =
    NEARBY_MESSAGES[Math.floor(Math.random() * NEARBY_MESSAGES.length)]!;

  const places = DEV_PLACE_NAMES.map((name, index) => ({
    name,
    category: '음식점',
    walkMin: Math.max(1, walkMin - index),
    distanceM: (index + 1) * 120,
    lat: params.lat + (index - 1) * 0.00025,
    lng: params.lng + index * 0.0002,
    address: '개발 샘플 데이터 (server/.env 에 KAKAO_REST_API_KEY 설정 시 실제 검색)',
    placeUrl: `https://map.kakao.com/link/map/${params.lat},${params.lng}`,
  }));

  return {
    menu,
    message,
    areaLabel: `현재 위치 · 도보 ${walkMin}분`,
    districtId: 'gps',
    districtLabel: '현재 위치',
    radiusWalkMin: walkMin,
    userLat: params.lat,
    userLng: params.lng,
    places,
    devFallback: true as const,
  };
}
