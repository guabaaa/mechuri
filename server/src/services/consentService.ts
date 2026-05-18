import { LEGAL_POLICY_VERSION } from '../data/legal';
import type { AuthUserRecord } from './authService';

export type UserConsents = {
  version: string;
  termsAt: number;
  privacyAt: number;
  locationAt: number;
};

const consentsByUserId = new Map<string, UserConsents>();

export function hasRequiredConsents(user: AuthUserRecord): boolean {
  const c = consentsByUserId.get(user.id);
  if (!c) {
    return false;
  }
  return c.version === LEGAL_POLICY_VERSION;
}

export function getUserConsents(userId: string): UserConsents | null {
  return consentsByUserId.get(userId) ?? null;
}

export function recordUserConsents(userId: string): UserConsents {
  const now = Date.now();
  const consents: UserConsents = {
    version: LEGAL_POLICY_VERSION,
    termsAt: now,
    privacyAt: now,
    locationAt: now,
  };
  consentsByUserId.set(userId, consents);
  return consents;
}
