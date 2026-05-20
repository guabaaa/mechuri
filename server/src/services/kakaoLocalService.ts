import { getKakaoRestApiKey } from '../config/kakaoKey';
import { haversineMeters } from '../utils/geo';

export type KakaoPlace = {
  id: string;
  name: string;
  category: string;
  distanceM: number;
  lat: number;
  lng: number;
  address?: string;
  placeUrl?: string;
};

function walkMinFromDistance(distanceM: number) {
  return Math.max(1, Math.round(distanceM / 80));
}

function mapKakaoDocument(
  doc: {
    id?: string;
    place_name?: string;
    category_name?: string;
    distance?: string;
    y?: string | number;
    x?: string | number;
    road_address_name?: string;
    address_name?: string;
    place_url?: string;
  },
  centerLat: number,
  centerLng: number,
): KakaoPlace | null {
  if (!doc.place_name || doc.y == null || doc.x == null) {
    return null;
  }
  const lat = Number(doc.y);
  const lng = Number(doc.x);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  const fromApi = Number(doc.distance ?? 0);
  const computed = Math.round(haversineMeters(centerLat, centerLng, lat, lng));
  const distanceM =
    fromApi > 0 && fromApi <= computed * 1.5 ? fromApi : computed;
  return {
    id: String(doc.id ?? doc.place_name),
    name: doc.place_name,
    category: (doc.category_name ?? '음식점').split(' > ').pop() ?? '음식점',
    distanceM,
    lat,
    lng,
    address: doc.road_address_name || doc.address_name,
    placeUrl: doc.place_url,
  };
}

export type KakaoLocalSearchResult = {
  places: KakaoPlace[];
  /** 카카오 API HTTP 상태 (실패 시) */
  httpStatus?: number;
};

export async function searchFoodPlacesNear(
  lat: number,
  lng: number,
  radiusM: number,
): Promise<KakaoLocalSearchResult> {
  const restKey = getKakaoRestApiKey();
  if (!restKey) {
    return { places: [] };
  }

  const url = new URL('https://dapi.kakao.com/v2/local/search/category.json');
  url.searchParams.set('category_group_code', 'FD6');
  url.searchParams.set('x', String(lng));
  url.searchParams.set('y', String(lat));
  url.searchParams.set('radius', String(Math.min(Math.max(radiusM, 100), 20000)));
  url.searchParams.set('sort', 'distance');
  url.searchParams.set('size', '15');

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${restKey}` },
    });
  } catch (e) {
    console.warn('Kakao Local API network error', e);
    return { places: [], httpStatus: 0 };
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.warn(`Kakao Local API ${res.status}`, detail.slice(0, 300));
    let httpStatus = res.status;
    if (detail.includes('OPEN_MAP_AND_LOCAL')) {
      httpStatus = 4031;
    }
    return { places: [], httpStatus };
  }

  const body = (await res.json()) as {
    documents?: Array<Parameters<typeof mapKakaoDocument>[0]>;
  };

  const maxDistanceM = Math.min(Math.max(radiusM, 100), 20000);
  const places = (body.documents ?? [])
    .map((doc) => mapKakaoDocument(doc, lat, lng))
    .filter((p): p is KakaoPlace => p != null && p.distanceM <= maxDistanceM)
    .sort((a, b) => a.distanceM - b.distanceM);

  return { places };
}

export function kakaoPlaceToNearbyPlace(place: KakaoPlace) {
  return {
    name: place.name,
    category: place.category,
    walkMin: walkMinFromDistance(place.distanceM),
    distanceM: place.distanceM,
    lat: place.lat,
    lng: place.lng,
    address: place.address,
    placeUrl: place.placeUrl,
  };
}
