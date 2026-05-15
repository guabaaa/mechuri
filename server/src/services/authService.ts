import { randomBytes } from 'node:crypto';
import { verifySocialCredential } from './authVerifier';

export type SocialProvider = 'kakao' | 'naver' | 'apple' | 'google' | 'guest';

export type AuthUserRecord = {
  id: string;
  provider: SocialProvider;
  nickname: string;
  createdAt: number;
};

const sessions = new Map<string, AuthUserRecord>();

function createToken() {
  return randomBytes(24).toString('hex');
}

export async function socialSignIn(input: {
  provider: SocialProvider;
  accessToken?: string;
  idToken?: string;
  nonce?: string;
}): Promise<{ token: string; user: AuthUserRecord }> {
  const verified = await verifySocialCredential(input);
  const user: AuthUserRecord = {
    id: `${verified.provider}_${verified.providerUserId}`,
    provider: verified.provider,
    nickname: verified.nickname,
    createdAt: Date.now(),
  };
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
