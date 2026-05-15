import type { AuthProviderId } from '../api/types';

export type SocialCredential = {
  provider: AuthProviderId;
  accessToken?: string;
  idToken?: string;
  nonce?: string;
};
