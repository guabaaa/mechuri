import { randomBytes } from 'node:crypto';
import {
  getUserConsents,
  hasRequiredConsents,
  recordUserConsents,
} from './consentService';
import { verifySocialCredential } from './authVerifier';

export type SocialProvider = 'kakao' | 'naver' | 'apple' | 'google' | 'guest';

export type AuthUserRecord = {
  id: string;
  provider: SocialProvider;
  nickname: string;
  createdAt: number;
};

const sessions = new Map<string, AuthUserRecord>();
/** 재로그인 시 닉네임 등 프로필 유지 */
const usersById = new Map<string, AuthUserRecord>();

function createToken() {
  return randomBytes(24).toString('hex');
}

export function normalizeNickname(raw: string): string {
  const nickname = raw.trim();
  if (nickname.length < 2) {
    throw new Error('NICKNAME_TOO_SHORT');
  }
  if (nickname.length > 12) {
    throw new Error('NICKNAME_TOO_LONG');
  }
  return nickname;
}

function syncSessionsForUser(user: AuthUserRecord) {
  for (const [token, sessionUser] of sessions) {
    if (sessionUser.id === user.id) {
      sessions.set(token, user);
    }
  }
}

export async function socialSignIn(input: {
  provider: SocialProvider;
  accessToken?: string;
  idToken?: string;
  nonce?: string;
}): Promise<{ token: string; user: AuthUserRecord }> {
  const verified = await verifySocialCredential(input);
  const id = `${verified.provider}_${verified.providerUserId}`;
  const existing = usersById.get(id);
  const user: AuthUserRecord = {
    id,
    provider: verified.provider,
    nickname: existing?.nickname ?? verified.nickname,
    createdAt: existing?.createdAt ?? Date.now(),
  };
  usersById.set(id, user);
  const token = createToken();
  sessions.set(token, user);
  return { token, user };
}

export function getUserByToken(token: string): AuthUserRecord | null {
  return sessions.get(token) ?? null;
}

export function revokeToken(token: string): void {
  sessions.delete(token);
}

export function toAuthUserResponse(user: AuthUserRecord) {
  return {
    id: user.id,
    provider: user.provider,
    nickname: user.nickname,
    joinedAt: new Date(user.createdAt).toISOString(),
    hasConsents: hasRequiredConsents(user),
    consents: getUserConsents(user.id),
  };
}

export function updateUserNickname(
  token: string,
  nicknameRaw: string,
): AuthUserRecord | null {
  const sessionUser = getUserByToken(token);
  if (!sessionUser) {
    return null;
  }
  const nickname = normalizeNickname(nicknameRaw);
  const updated: AuthUserRecord = { ...sessionUser, nickname };
  usersById.set(updated.id, updated);
  syncSessionsForUser(updated);
  return updated;
}

export function submitUserConsents(token: string) {
  const user = getUserByToken(token);
  if (!user) {
    return null;
  }
  recordUserConsents(user.id);
  return toAuthUserResponse(user);
}
