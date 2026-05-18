import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchMe,
  logout as logoutApi,
  socialSignIn,
  submitConsents as submitConsentsApi,
  updateProfile as updateProfileApi,
} from '../api/authApi';
import { ApiError } from '../api/client';
import { setAuthToken } from '../api/authToken';
import { API_BASE_URL } from '../config/api';
import { obtainSocialCredential, signOutSocialSdks } from '../auth/socialAuth';
import { SocialAuthError } from '../auth/SocialAuthError';
import type { AuthProviderId, AuthUser } from '../api/types';

const STORAGE_KEY = 'mechuri-auth-v2';

type StoredAuth = {
  token: string;
  user: AuthUser;
};

type AuthContextValue = {
  ready: boolean;
  user: AuthUser | null;
  signIn: (provider: AuthProviderId) => Promise<void>;
  submitConsents: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const persist = useCallback(async (session: StoredAuth | null) => {
    if (!session) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
      setUser(null);
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuthToken(session.token);
    setUser(session.user);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw) as StoredAuth;
        if (!parsed?.token || !parsed?.user?.nickname) {
          return;
        }
        setAuthToken(parsed.token);
        try {
          const me = await fetchMe();
          if (!cancelled) {
            const next = { token: parsed.token, user: me };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setUser(me);
          }
        } catch {
          if (!cancelled) {
            setUser(parsed.user);
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

  const signIn = useCallback(
    async (provider: AuthProviderId) => {
      const credential = await obtainSocialCredential(provider);
      const session = await socialSignIn(credential);
      await persist(session);
    },
    [persist],
  );

  const submitConsents = useCallback(async () => {
    const me = await submitConsentsApi();
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredAuth;
      await persist({ token: parsed.token, user: me });
    } else {
      setUser(me);
    }
  }, [persist]);

  const updateNickname = useCallback(
    async (nickname: string) => {
      const me = await updateProfileApi({ nickname });
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAuth;
        await persist({ token: parsed.token, user: me });
      } else {
        setUser(me);
      }
    },
    [persist],
  );

  const signOut = useCallback(async () => {
    const provider = user?.provider;
    try {
      await logoutApi();
    } catch {
      /* 서버 세션 없어도 로컬은 지움 */
    }
    if (provider) {
      await signOutSocialSdks(provider);
    }
    await persist(null);
  }, [persist, user?.provider]);

  const value = useMemo(
    () => ({ ready, user, signIn, submitConsents, updateNickname, signOut }),
    [ready, user, signIn, submitConsents, updateNickname, signOut],
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

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof SocialAuthError) {
    if (error.code === 'CANCELLED') {
      return error.message;
    }
    return error.message;
  }
  if (error instanceof ApiError) {
    if (error.code === 'INVALID_TOKEN' && error.message.includes('카카오')) {
      return `${error.message} (개발: yarn server 재시작, 카카오 콘솔 번들 ID com.mechuri 확인)`;
    }
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return __DEV__
    ? `로그인에 실패했어요. yarn server 및 API(${API_BASE_URL})를 확인해 주세요.`
    : '로그인에 실패했어요. 잠시 후 다시 시도해 주세요.';
}
