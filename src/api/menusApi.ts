import { apiRequest } from './client';
import type {
  DeliveryCategory,
  MenuPickResult,
  MenuPoolResult,
  SituationPickResult,
  SituationSummary,
} from './types';

export function fetchMenuPool() {
  return apiRequest<MenuPoolResult>('/api/v1/menus/pool');
}

export function fetchDeliveryMenu(
  exclude?: string,
  category: DeliveryCategory = 'meal',
) {
  return apiRequest<MenuPickResult>('/api/v1/menus/delivery', {
    method: 'POST',
    body: JSON.stringify({ exclude, category }),
  });
}

export function fetchTodayMenu(exclude?: string) {
  return apiRequest<MenuPickResult>('/api/v1/menus/today', {
    method: 'POST',
    body: JSON.stringify({ exclude }),
  });
}

export function fetchSituations() {
  return apiRequest<SituationSummary[]>('/api/v1/menus/situations');
}

export function fetchSituationMenu(situationId: string) {
  return apiRequest<SituationPickResult>('/api/v1/menus/situation', {
    method: 'POST',
    body: JSON.stringify({ situationId }),
  });
}

export function fetchRouletteMenu(excluded: string[] = []) {
  return apiRequest<MenuPickResult>('/api/v1/menus/roulette', {
    method: 'POST',
    body: JSON.stringify({ excluded }),
  });
}
