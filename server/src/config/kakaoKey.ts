import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readAuthLocalRestKey(): string {
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
    if (rest?.[1]?.trim()) {
      return rest[1].trim();
    }
  }
  return '';
}

/** KAKAO_REST_API_KEY 우선, 없으면 auth.local.ts 의 restApiKey / nativeAppKey */
export function getKakaoRestApiKey(): string {
  return (
    process.env.KAKAO_REST_API_KEY?.trim() ||
    readAuthLocalRestKey() ||
    ''
  );
}
