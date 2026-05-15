import { apiRequest } from './client';
import type { FortuneResult } from './types';

export function fetchFortune(birthday: string) {
  return apiRequest<FortuneResult>('/api/v1/fortune', {
    method: 'POST',
    body: JSON.stringify({ birthday }),
  });
}
