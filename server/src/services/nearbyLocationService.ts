import {
  MOOD_MENU_BOOST,
  NEARBY_MESSAGES,
  NEARBY_MENUS,
  type NearbyMood,
  type WalkRadiusMin,
} from '../data/nearby';
import { ApiError } from '../middleware/errorHandler';
import {
  getKakaoRestApiKey,
  isLikelyNativeKeyMisusedAsRest,
} from '../config/kakaoKey';
import {
  kakaoPlaceToNearbyPlace,
  searchFoodPlacesNear,
  type KakaoPlace,
} from './kakaoLocalService';
import { isInKorea, normalizeKoreaCoords } from '../utils/geo';

export type NearbyAreaInfo = {
  /** 예: 서울 강남구 */
  label: string;
  city: string;
  district: string;
  inKorea: boolean;
};

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

function formatAreaFromRegionDoc(doc: {
  region_1depth_name?: string;
  region_2depth_name?: string;
}): NearbyAreaInfo {
  const city = doc.region_1depth_name?.trim() ?? '';
  const district = doc.region_2depth_name?.trim() ?? '';
  const label = [city, district].filter(Boolean).join(' ') || '현재 위치';
  return {
    label,
    city,
    district,
    inKorea: true,
  };
}

export async function reverseGeocodeArea(
  lat: number,
  lng: number,
): Promise<NearbyAreaInfo> {
  const { lat: nLat, lng: nLng } = normalizeKoreaCoords(lat, lng);
  if (!isInKorea(nLat, nLng)) {
    return {
      label: '위치를 확인할 수 없어요',
      city: '',
      district: '',
      inKorea: false,
    };
  }

  const restKey = getKakaoRestApiKey();
  if (!restKey) {
    return {
      label: '현재 위치',
      city: '',
      district: '',
      inKorea: true,
    };
  }

  const url = new URL('https://dapi.kakao.com/v2/local/geo/coord2regioncode.json');
  url.searchParams.set('x', String(nLng));
  url.searchParams.set('y', String(nLat));

  try {
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${restKey}` },
    });
    if (!res.ok) {
      return { label: '현재 위치', city: '', district: '', inKorea: true };
    }
    const body = (await res.json()) as {
      documents?: {
        region_1depth_name?: string;
        region_2depth_name?: string;
      }[];
    };
    const doc = body?.documents?.[0];
    if (!doc) {
      return { label: '현재 위치', city: '', district: '', inKorea: true };
    }
    return formatAreaFromRegionDoc(doc);
  } catch {
    return { label: '현재 위치', city: '', district: '', inKorea: true };
  }
}

/** @deprecated reverseGeocodeArea 사용 */
export async function reverseGeocodeLabel(lat: number, lng: number): Promise<string> {
  const area = await reverseGeocodeArea(lat, lng);
  return area.label;
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
  const { lat, lng } = normalizeKoreaCoords(params.lat, params.lng);
  const { places: placesRaw, httpStatus } = await searchFoodPlacesNear(
    lat,
    lng,
    radiusM,
  );

  if (placesRaw.length === 0) {
    const restKey = getKakaoRestApiKey();
    if (!restKey) {
      throw new ApiError(
        503,
        'KAKAO_KEY_MISSING',
        '카카오 REST API 키가 없어요. server/.env 에 KAKAO_REST_API_KEY 를 넣거나 auth.local.ts 의 restApiKey(네이티브 키 아님)를 설정한 뒤 서버를 재시작해 주세요.',
      );
    }
    if (httpStatus) {
      const misuse = restKey && isLikelyNativeKeyMisusedAsRest();
      throw new ApiError(
        502,
        'KAKAO_LOCAL_ERROR',
        httpStatus === 4031
          ? '카카오 콘솔에서 「지도/로컬」(OPEN_MAP_AND_LOCAL) 서비스를 활성화해 주세요. developers.kakao.com → 내 애플리케이션 → 제품 설정'
          : httpStatus === 403
            ? misuse
              ? '네이티브 앱 키가 아닌 REST API 키를 써야 해요. 카카오 디벨로퍼스 → 앱 키 → REST API 키를 server/.env 에 넣어 주세요.'
              : '카카오 REST API 키가 거부됐어요. REST API 키·IP 제한·로컬 API 사용 설정을 확인해 주세요.'
            : `카카오 로컬 API 오류(${httpStatus}). 잠시 후 다시 시도해 주세요.`,
      );
    }
    return null;
  }

  const area = await reverseGeocodeArea(lat, lng);
  const areaLabelBase = area.label;
  const topPlaces = placesRaw.slice(0, 5);
  if (topPlaces.length === 0) {
    return null;
  }
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
    userLat: lat,
    userLng: lng,
    places: topPlaces.slice(0, 3).map(kakaoPlaceToNearbyPlace),
  };
}
