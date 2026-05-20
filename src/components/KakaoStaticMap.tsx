import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { buildKakaoStaticMapUrl } from '../api/nearbyMapUrl';
import type { NearbyPlace } from '../api/types';
import { API_BASE_URL } from '../config/api';
import { kakaoMapLink } from '../config/maps';
import { colors } from '../theme';
import { fonts } from '../theme/typography';

type Props = {
  userLat: number;
  userLng: number;
  places?: NearbyPlace[];
  height?: number;
};

export default function KakaoStaticMap({
  userLat,
  userLng,
  places = [],
  height = 220,
}: Props) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapSource, setMapSource] = useState<'kakao' | 'fallback' | null>(null);

  const uri = useMemo(
    () =>
      buildKakaoStaticMapUrl({
        lat: userLat,
        lng: userLng,
        width: 400,
        height,
        places,
      }),
    [userLat, userLng, height, places],
  );

  useEffect(() => {
    setFailed(false);
    setLoading(true);
    setMapSource(null);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(uri, { method: 'HEAD' });
        if (cancelled) {
          return;
        }
        const source = res.headers.get('X-Mechuri-Map-Source');
        setMapSource(source === 'fallback' ? 'fallback' : 'kakao');
        if (!res.ok) {
          setFailed(true);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setMapSource(null);
          setFailed(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uri]);

  if (failed) {
    return (
      <View style={[styles.wrap, styles.fallback, { height }]}>
        <Text style={styles.fallbackTitle}>지도를 불러오지 못했어요</Text>
        <Text style={styles.fallbackHint}>
          지도 API: {API_BASE_URL}
          {'\n\n'}
          {__DEV__
            ? '개발: 터미널에서 yarn server 실행. 실제 기기면 src/config/api.local.ts 에 맥 IP 설정.'
            : '인터넷 연결을 확인해 주세요.'}
          {'\n\n'}
          카카오 지도(선택): server/.env 또는 auth.local.ts 에 REST API 키 후 서버 재시작.
        </Text>
        <Pressable
          onPress={() => Linking.openURL(kakaoMapLink(userLat, userLng))}
          style={styles.linkBtn}>
          <Text style={styles.linkBtnText}>카카오맵에서 보기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { height }]}>
      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          color={colors.orange}
          size="large"
        />
      ) : null}
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
        accessibilityLabel="근처 지도"
      />
      {mapSource === 'fallback' ? (
        <View style={styles.fallbackBadge}>
          <Text style={styles.fallbackBadgeText}>임시 지도 · REST 키 설정 시 카카오 지도</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.tileBorder,
    backgroundColor: colors.cream,
  },
  loader: { ...StyleSheet.absoluteFill },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.white,
  },
  fallbackTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
    marginBottom: 8,
  },
  fallbackHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  linkBtn: {
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  linkBtnText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.orange,
  },
  fallbackBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: colors.tileBorder,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  fallbackBadgeText: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.taupe,
  },
});
