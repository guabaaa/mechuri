import { apiRequest } from './client';
import type { NearbyDistrict, NearbyMood, NearbyPickResult } from './types';

export function fetchNearbyDistricts() {
  return apiRequest<NearbyDistrict[]>('/api/v1/nearby/districts');
}

export type NearbyAreaLabel = {
  label: string;
  city: string;
  district: string;
  inKorea: boolean;
};

export function fetchNearbyAreaLabel(lat: number, lng: number) {
  const q = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
  });
  return apiRequest<NearbyAreaLabel>(`/api/v1/nearby/area-label?${q}`);
}

export function fetchNearbyPick(params: {
  lat: number;
  lng: number;
  radiusWalkMin?: 5 | 10 | 15;
  mood?: NearbyMood;
  exclude?: string;
}) {
  return apiRequest<NearbyPickResult>('/api/v1/nearby/pick', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
