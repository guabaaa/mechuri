import { getKakaoRestApiKey } from '../config/kakaoKey';

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

function mapKakaoDocument(doc: {
  id?: string;
  place_name?: string;
  category_name?: string;
  distance?: string;
  y?: string | number;
  x?: string | number;
  road_address_name?: string;
  address_name?: string;
  place_url?: string;
}): KakaoPlace | null {
  if (!doc.place_name || doc.y == null || doc.x == null) {
    return null;
  }
  const distanceM = Number(doc.distance ?? 0);
  return {
    id: String(doc.id ?? doc.place_name),
    name: doc.place_name,
    category: (doc.category_name ?? '음식점').split(' > ').pop() ?? '음식점',
    distanceM,
    lat: Number(doc.y),
    lng: Number(doc.x),
    address: doc.road_address_name || doc.address_name,
    placeUrl: doc.place_url,
  };
}

export async function searchFoodPlacesNear(
  lat: number,
  lng: number,
  radiusM: number,
): Promise<KakaoPlace[]> {
  const restKey = getKakaoRestApiKey();
  if (!restKey) {
    return [];
  }

  const url = new URL('https://dapi.kakao.com/v2/local/search/category.json');
  url.searchParams.set('category_group_code', 'FD6');
  url.searchParams.set('x', String(lng));
  url.searchParams.set('y', String(lat));
  url.searchParams.set('radius', String(Math.min(Math.max(radiusM, 100), 20000)));
  url.searchParams.set('sort', 'distance');
  url.searchParams.set('size', '15');

  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${restKey}` },
  });

  if (!res.ok) {
    throw new Error(`Kakao Local API error: ${res.status}`);
  }

  const body = (await res.json()) as {
    documents?: Array<Parameters<typeof mapKakaoDocument>[0]>;
  };

  return (body.documents ?? [])
    .map(mapKakaoDocument)
    .filter((p): p is KakaoPlace => p != null)
    .sort((a, b) => a.distanceM - b.distanceM);
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
