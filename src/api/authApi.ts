import { apiRequest } from './client';
import type { SocialCredential } from '../auth/types';
import type { AuthSession, AuthUser } from './types';

export function socialSignIn(credential: SocialCredential) {
  return apiRequest<AuthSession>('/api/v1/auth/social', {
    method: 'POST',
    body: JSON.stringify(credential),
  });
}

export { submitConsents } from './consentApi';

export function fetchMe() {
  return apiRequest<AuthUser>('/api/v1/auth/me');
}

export function updateProfile(input: { nickname: string }) {
  return apiRequest<AuthUser>('/api/v1/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function logout() {
  return apiRequest<{ ok: boolean }>('/api/v1/auth/logout', {
    method: 'POST',
  });
}
