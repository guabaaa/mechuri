import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

export type NearbyCoords = {
  lat: number;
  lng: number;
};

export type LocationStatus = 'loading' | 'ready' | 'denied' | 'unavailable';

export function useNearbyLocation() {
  const [status, setStatus] = useState<LocationStatus>('loading');
  const [coords, setCoords] = useState<NearbyCoords | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const current = await check(permission);
    if (current === RESULTS.GRANTED || current === RESULTS.LIMITED) {
      return true;
    }
    if (current === RESULTS.BLOCKED) {
      return false;
    }
    const next = await request(permission);
    return next === RESULTS.GRANTED || next === RESULTS.LIMITED;
  }, []);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);
    const granted = await requestPermission();
    if (!granted) {
      setStatus('denied');
      setCoords(null);
      setError('위치 권한이 필요해요. 설정에서 허용해 주세요.');
      return;
    }

    return new Promise<void>((resolve) => {
      Geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setStatus('ready');
          resolve();
        },
        () => {
          setStatus('unavailable');
          setCoords(null);
          setError('현재 위치를 가져오지 못했어요. GPS를 켜고 다시 시도해 주세요.');
          resolve();
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        },
      );
    });
  }, [requestPermission]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return { status, coords, error, refresh, openSettings };
}
