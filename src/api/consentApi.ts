import { apiRequest } from './client';
import type { AuthUser } from './types';

export function submitConsents() {
  return apiRequest<AuthUser>('/api/v1/auth/consent', {
    method: 'POST',
    body: JSON.stringify({
      terms: true,
      privacy: true,
      location: true,
    }),
  });
}
