import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type AuthLocalKakaoKeys = {
  restApiKey: string;
  nativeAppKey: string;
};

function readAuthLocalKakaoKeys(): AuthLocalKakaoKeys {
  const paths = [
    resolve(process.cwd(), '../src/config/auth.local.ts'),
    resolve(process.cwd(), 'src/config/auth.local.ts'),
  ];
  for (const filePath of paths) {
    if (!existsSync(filePath)) {
      continue;
    }
    const text = readFileSync(filePath, 'utf8');
    const rest = text.match(/restApiKey:\s*['"]([^'"]+)['"]/);
    const native = text.match(/nativeAppKey:\s*['"]([^'"]+)['"]/);
    return {
      restApiKey: rest?.[1]?.trim() ?? '',
      nativeAppKey: native?.[1]?.trim() ?? '',
    };
  }
  return { restApiKey: '', nativeAppKey: '' };
}

/** KAKAO_REST_API_KEY 우선, 없으면 auth.local.ts 의 restApiKey */
export function getKakaoRestApiKey(): string {
  return (
    process.env.KAKAO_REST_API_KEY?.trim() ||
    readAuthLocalKakaoKeys().restApiKey ||
    ''
  );
}

/** 네이티브 앱 키를 REST 자리에 넣은 경우 (로컬 API 403) */
export function isLikelyNativeKeyMisusedAsRest(): boolean {
  const rest = getKakaoRestApiKey();
  if (!rest) {
    return false;
  }
  const { nativeAppKey } = readAuthLocalKakaoKeys();
  return Boolean(nativeAppKey && rest === nativeAppKey);
}

export function logKakaoKeyStatus(): void {
  const key = getKakaoRestApiKey();
  if (!key) {
    console.warn(
      '[mechuri] KAKAO_REST_API_KEY 없음 → 근처 먹기·지도 불가. server/.env 또는 auth.local.ts restApiKey 설정',
    );
    return;
  }
  if (isLikelyNativeKeyMisusedAsRest()) {
    console.warn(
      '[mechuri] restApiKey가 nativeAppKey와 같습니다. developers.kakao.com 의 REST API 키를 사용하세요.',
    );
    return;
  }
  console.log(`[mechuri] Kakao REST API 키 로드됨 (…${key.slice(-4)})`);
}
