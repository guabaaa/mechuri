import { API_BASE_URL } from '../config/api';
import type { NearbyPlace } from './types';

export function buildKakaoStaticMapUrl(params: {
  lat: number;
  lng: number;
  width?: number;
  height?: number;
  places?: NearbyPlace[];
}) {
  const url = new URL(`${API_BASE_URL}/api/v1/nearby/map-static`);
  url.searchParams.set('lat', String(params.lat));
  url.searchParams.set('lng', String(params.lng));
  url.searchParams.set('w', String(params.width ?? 400));
  url.searchParams.set('h', String(params.height ?? 220));

  const markers = (params.places ?? [])
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => `${p.lat},${p.lng}`)
    .join(';');
  if (markers) {
    url.searchParams.set('markers', markers);
  }

  return url.toString();
}
