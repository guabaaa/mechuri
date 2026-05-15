import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'mechuri-auth-v1';

export type AuthProviderId = 'kakao' | 'naver' | 'apple' | 'google' | 'guest';

export type AuthUser = {
  provider: AuthProviderId;
  nickname: string;
};

type AuthContextValue = {
  ready: boolean;
  user: AuthUser | null;
  signIn: (provider: AuthProviderId) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const PROVIDER_PREFIX: Record<AuthProviderId, string> = {
  kakao: '카카오',
  naver: '네이버',
  apple: 'Apple',
  google: 'Google',
  guest: '게스트',
};

function randomSuffix() {
  return String(1000 + Math.floor(Math.random() * 9000));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) {
          return;
        }
        if (raw) {
          const parsed = JSON.parse(raw) as AuthUser;
          if (parsed?.nickname && parsed?.provider) {
            setUser(parsed);
          }
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (provider: AuthProviderId) => {
    /**
     * 실제 서비스 연동 시:
     * - 카카오: @react-native-seoul/kakao-login + 네이티브 키
     * - 네이버: 네이버 로그인 SDK
     * - Apple: @invertase/react-native-apple-authentication
     * - Google: @react-native-google-signin/google-signin
     * 여기서는 UI·플로우 검증용으로 닉네임만 저장합니다.
     */
    const nickname =
      provider === 'guest'
        ? `게스트${randomSuffix()}`
        : `${PROVIDER_PREFIX[provider]}${randomSuffix()}`;
    const next: AuthUser = { provider, nickname };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ ready, user, signIn, signOut }),
    [ready, user, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be inside AuthProvider');
  }
  return ctx;
}
