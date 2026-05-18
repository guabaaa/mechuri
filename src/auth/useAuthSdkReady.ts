import { useEffect, useState } from 'react';
import { initAuthSdks } from './initAuth';

export function useAuthSdkReady() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    initAuthSdks()
      .then(() => {
        if (!cancelled) {
          setReady(true);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '로그인 SDK 초기화 실패');
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, error };
}
