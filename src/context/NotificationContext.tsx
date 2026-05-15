import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'mechuri-notifications-v1';

type NotificationContextValue = {
  hasUnread: boolean;
  /** 새 알림이 왔을 때 (다른 화면·서버 연동용) */
  notify: () => Promise<void>;
  /** 알림함 열기·아이콘 탭 시 */
  markRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw === '1') {
          setHasUnread(true);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const notify = useCallback(async () => {
    setHasUnread(true);
    await AsyncStorage.setItem(STORAGE_KEY, '1');
  }, []);

  const markRead = useCallback(async () => {
    setHasUnread(false);
    await AsyncStorage.setItem(STORAGE_KEY, '0');
  }, []);

  const value = useMemo(
    () => ({ hasUnread, notify, markRead }),
    [hasUnread, notify, markRead],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be inside NotificationProvider');
  }
  return ctx;
}
