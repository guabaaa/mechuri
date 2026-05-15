export function isAuthSkipVerify() {
  return process.env.AUTH_SKIP_VERIFY === 'true';
}

export function getAuthEnv() {
  return {
    skipVerify: isAuthSkipVerify(),
    naverClientId: process.env.NAVER_CLIENT_ID ?? '',
    naverClientSecret: process.env.NAVER_CLIENT_SECRET ?? '',
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
    appleBundleId: process.env.APPLE_BUNDLE_ID ?? 'com.mechuri',
  };
}
