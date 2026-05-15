import { apiRequest } from './client';
import type { NearbyDistrict, NearbyMood, NearbyPickResult } from './types';

export function fetchNearbyDistricts() {
  return apiRequest<NearbyDistrict[]>('/api/v1/nearby/districts');
}

export function fetchNearbyPick(params: {
  districtId: string;
  radiusWalkMin?: 5 | 10 | 15;
  mood?: NearbyMood;
  exclude?: string;
}) {
  return apiRequest<NearbyPickResult>('/api/v1/nearby/pick', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
