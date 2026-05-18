import {
  MOOD_MENU_BOOST,
  NEARBY_MESSAGES,
  NEARBY_MENUS,
  type NearbyMood,
  type WalkRadiusMin,
} from '../data/nearby';
import { getKakaoRestApiKey } from '../config/kakaoKey';
import {
  kakaoPlaceToNearbyPlace,
  searchFoodPlacesNear,
  type KakaoPlace,
} from './kakaoLocalService';
import { pickNearbyAtLocationDevFallback } from './nearbyDevFallback';

const WALK_RADIUS_METERS: Record<WalkRadiusMin, number> = {
  5: 400,
  10: 800,
  15: 1200,
};

function pickRandom<T>(pool: readonly T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function inferMenuFromPlace(place: KakaoPlace, mood?: NearbyMood): string {
  const cat = place.category;
  const pool = mood ? [...MOOD_MENU_BOOST[mood], ...NEARBY_MENUS.mixed] : [...NEARBY_MENUS.mixed];
  const keywordMap: [RegExp, string][] = [
    [/치킨/, '치킨'],
    [/피자/, '피자'],
    [/카페|커피/, '커피'],
    [/분식|떡볶이/, '분식'],
    [/초밥|일식|스시/, '초밥'],
    [/중국|짜장|마라/, '마라탕'],
    [/고기|삼겹|갈비|육류/, '삼겹살'],
    [/국밥|찌개|한식/, '김치찌개'],
    [/버거|햄버거/, '버거'],
    [/면|라멘|우동/, '라면'],
  ];
  for (const [re, menu] of keywordMap) {
    if (re.test(cat) || re.test(place.name)) {
      return menu;
    }
  }
  return pickRandom(pool);
}

function reverseGeocodeLabel(lat: number, lng: number): Promise<string> {
  const restKey = getKakaoRestApiKey();
  if (!restKey) {
    return Promise.resolve('현재 위치');
  }
  const url = new URL('https://dapi.kakao.com/v2/local/geo/coord2regioncode.json');
  url.searchParams.set('x', String(lng));
  url.searchParams.set('y', String(lat));

  return fetch(url, {
    headers: { Authorization: `KakaoAK ${restKey}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((body: { documents?: { region_2depth_name?: string; region_3depth_name?: string }[] } | null) => {
      const doc = body?.documents?.[0];
      if (!doc) {
        return '현재 위치';
      }
      return [doc.region_2depth_name, doc.region_3depth_name].filter(Boolean).join(' ');
    })
    .catch(() => '현재 위치');
}

export async function pickNearbyAtLocation(params: {
  lat: number;
  lng: number;
  radiusWalkMin?: WalkRadiusMin;
  mood?: NearbyMood;
  exclude?: string;
}) {
  const walkMin = params.radiusWalkMin ?? 10;
  const radiusM = WALK_RADIUS_METERS[walkMin];
  const placesRaw = await searchFoodPlacesNear(
    params.lat,
    params.lng,
    radiusM,
  );

  if (placesRaw.length === 0) {
    const restKey = getKakaoRestApiKey();
    if (!restKey && process.env.NODE_ENV !== 'production') {
      return pickNearbyAtLocationDevFallback(params);
    }
    return null;
  }

  const areaLabelBase = await reverseGeocodeLabel(params.lat, params.lng);
  const topPlaces = placesRaw.slice(0, 5);
  const anchor = pickRandom(topPlaces);
  let menu = inferMenuFromPlace(anchor, params.mood);
  if (params.exclude && menu === params.exclude && topPlaces.length > 1) {
    const alt = topPlaces.find((p) => inferMenuFromPlace(p, params.mood) !== params.exclude);
    if (alt) {
      menu = inferMenuFromPlace(alt, params.mood);
    }
  }

  const message =
    NEARBY_MESSAGES[Math.floor(Math.random() * NEARBY_MESSAGES.length)]!;

  return {
    menu,
    message,
    areaLabel: `${areaLabelBase} · 도보 ${walkMin}분`,
    districtId: 'gps',
    districtLabel: areaLabelBase,
    radiusWalkMin: walkMin,
    userLat: params.lat,
    userLng: params.lng,
    places: topPlaces.slice(0, 3).map(kakaoPlaceToNearbyPlace),
  };
}
