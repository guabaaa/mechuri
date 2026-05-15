export type SocialAuthErrorCode =
  | 'NOT_CONFIGURED'
  | 'CANCELLED'
  | 'FAILED'
  | 'UNSUPPORTED';

export class SocialAuthError extends Error {
  constructor(
    public code: SocialAuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'SocialAuthError';
  }
}
