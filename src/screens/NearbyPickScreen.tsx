import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchNearbyPick } from '../api/nearbyApi';
import type { NearbyMood, NearbyPickResult } from '../api/types';
import { ApiError } from '../api/client';
import { nearbyIcon, nearbyPageLogo } from '../assets';
import {
  FeatureActionButton,
  NearbyLocationPanel,
  ScreenContainer,
} from '../components';
import { useNearbyLocation } from '../location/useNearbyLocation';
import type { MainTabParamList } from '../navigation/types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { menuEmoji } from '../utils/menuEmoji';

function NearbyPageHero({ sub }: { sub: string }) {
  return (
    <View style={styles.hero}>
      <Image
        source={nearbyPageLogo}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="근처에서 먹기"
      />
      <Text style={styles.sub}>{sub}</Text>
    </View>
  );
}

const WALK_OPTIONS = [5, 10, 15] as const;
const MOODS: { id: NearbyMood; label: string; icon: string }[] = [
  { id: 'solo', label: '혼밥', icon: '🙋' },
  { id: 'team', label: '동료랑', icon: '👥' },
  { id: 'light', label: '가볍게', icon: '🥗' },
  { id: 'hearty', label: '든든하게', icon: '🍖' },
];

export default function NearbyPickScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const showBack = navigation.canGoBack();
  const { status, coords, error: locError, refresh, openSettings } =
    useNearbyLocation();

  const [radiusWalkMin, setRadiusWalkMin] = useState<5 | 10 | 15>(10);
  const [mood, setMood] = useState<NearbyMood | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NearbyPickResult | null>(null);
  const [placesRevealed, setPlacesRevealed] = useState(false);

  const runPick = useCallback(
    async (exclude?: string) => {
      if (!coords) {
        setError('위치를 먼저 불러와 주세요.');
        return;
      }
      setSubmitting(true);
      setError(null);
      setPlacesRevealed(false);
      try {
        const picked = await fetchNearbyPick({
          lat: coords.lat,
          lng: coords.lng,
          radiusWalkMin,
          mood: mood ?? undefined,
          exclude,
        });
        setResult(picked);
      } catch (e) {
        setError(
          e instanceof ApiError
            ? e.message
            : '서버에 연결할 수 없어요. yarn server 를 실행해 주세요.',
        );
        setResult(null);
      } finally {
        setSubmitting(false);
      }
    },
    [coords, mood, radiusWalkMin],
  );

  const resetPick = useCallback(() => {
    setResult(null);
    setPlacesRevealed(false);
  }, []);

  const openRecipe = (menu: string) => {
    navigation.navigate('HomeTab', {
      screen: 'Recipe',
      params: { menu },
    });
  };

  const openPlace = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  if (status === 'loading') {
    return (
      <ScreenContainer scroll={false}>
        <ActivityIndicator
          size="large"
          color={colors.orange}
          style={styles.loader}
        />
        <Text style={styles.loadingText}>현재 위치를 찾는 중...</Text>
      </ScreenContainer>
    );
  }

  if (status === 'denied' || status === 'unavailable' || !coords) {
    return (
      <ScreenContainer>
        <NearbyPageHero sub={locError ?? '위치를 사용할 수 없어요.'} />
        <FeatureActionButton
          label="다시 시도"
          iconImage={nearbyIcon}
          tint={homeTileTints.nearby}
          onPress={refresh}
        />
        {status === 'denied' ? (
          <Pressable onPress={openSettings} style={styles.settingsLink}>
            <Text style={styles.settingsText}>설정 열기</Text>
          </Pressable>
        ) : null}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.screen}>
      {showBack ? (
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← 홈</Text>
        </Pressable>
      ) : null}

      <NearbyPageHero sub={'내 위치 기준으로\n가까운 음식점을 찾아드려요'} />

      <NearbyLocationPanel
        userLat={coords.lat}
        userLng={coords.lng}
        places={result?.places}
        height={result ? 200 : 240}
      />

      {!result ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>도보 거리</Text>
            <View style={styles.chipRow}>
              {WALK_OPTIONS.map((min) => (
                <Pressable
                  key={min}
                  onPress={() => setRadiusWalkMin(min)}
                  style={[
                    styles.chip,
                    radiusWalkMin === min && styles.chipActive,
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      radiusWalkMin === min && styles.chipTextActive,
                    ]}>
                    {min}분
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>분위기 (선택)</Text>
            <View style={styles.chipRow}>
              {MOODS.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() =>
                    setMood((prev) => (prev === m.id ? null : m.id))
                  }
                  style={[styles.chip, mood === m.id && styles.chipActive]}>
                  <Text
                    style={[
                      styles.chipText,
                      mood === m.id && styles.chipTextActive,
                    ]}>
                    {m.icon} {m.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <FeatureActionButton
            label="근처 메뉴 찾기"
            icon="📍"
            tint={homeTileTints.nearby}
            loading={submitting}
            disabled={submitting}
            onPress={() => runPick()}
          />

          <Pressable onPress={refresh} style={styles.refreshLink}>
            <Text style={styles.refreshText}>위치 새로고침</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.resultBlock}>
          <View style={[styles.resultCard, shadows.card]}>
            <Text style={styles.areaBadge}>{result.areaLabel}</Text>
            <Text style={styles.resultEmoji}>{menuEmoji(result.menu)}</Text>
            <Text style={styles.resultLabel}>오늘 이거 어때요?</Text>
            <Text style={styles.resultMenu}>{result.menu}</Text>
            <View style={styles.messageBox}>
              <Text style={styles.resultMessage}>{result.message}</Text>
            </View>
          </View>

          <View style={[styles.placesCard, shadows.card]}>
            <Text style={styles.placesTitle}>🍽 가볼 만한 곳</Text>
            {placesRevealed ? (
              result.places.map((place) => (
                <Pressable
                  key={`${place.name}-${place.lat}`}
                  onPress={() => openPlace(place.placeUrl)}
                  style={styles.placeRow}>
                  <View style={styles.placeBody}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeMeta}>
                      {place.category}
                      {place.distanceM != null
                        ? ` · ${place.distanceM}m`
                        : ` · 도보 ${place.walkMin}분`}
                    </Text>
                    {place.address ? (
                      <Text style={styles.placeAddr}>{place.address}</Text>
                    ) : null}
                  </View>
                  {place.placeUrl ? (
                    <Text style={styles.placeLink}>지도 ›</Text>
                  ) : null}
                </Pressable>
              ))
            ) : (
              <Pressable
                onPress={() => setPlacesRevealed(true)}
                style={styles.revealPlacesBtn}>
                <Text style={styles.revealPlacesText}>가게 목록 보기 👀</Text>
              </Pressable>
            )}
            <Text style={styles.placesHint}>
              카카오맵 정보 기반 참고용이에요. 방문·주문 전 매장에서 다시 확인해
              주세요.
            </Text>
          </View>

          <View style={styles.actions}>
            <FeatureActionButton
              label="다시 찾기"
              icon="📍"
              tint={homeTileTints.nearby}
              loading={submitting}
              disabled={submitting}
              onPress={() => runPick(result.menu)}
            />
            <FeatureActionButton
              label="레시피 보기"
              icon="📖"
              tint={homeTileTints.recipe}
              onPress={() => openRecipe(result.menu)}
            />
          </View>

          <Pressable onPress={resetPick} style={styles.editLink}>
            <Text style={styles.editLinkText}>조건 바꿔서 다시 고르기</Text>
          </Pressable>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: 36 },
  loader: { marginTop: 80 },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    textAlign: 'center',
    marginTop: 12,
  },
  back: { marginTop: 4, marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontFamily: fonts.body, fontSize: 15, color: colors.tileText },
  hero: { alignItems: 'center', paddingVertical: 4, marginBottom: 10 },
  logo: {
    width: 280,
    height: 184,
    marginBottom: 8,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: { marginBottom: 16, marginTop: 16 },
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.brown,
    marginBottom: 10,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: homeTileTints.nearby,
    borderColor: colors.orange,
  },
  chipText: { fontFamily: fonts.body, fontSize: 13, color: colors.tileText },
  chipTextActive: { fontFamily: fonts.display, color: colors.brown },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 12,
  },
  refreshLink: { alignSelf: 'center', marginTop: 12 },
  refreshText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    textDecorationLine: 'underline',
  },
  settingsLink: { alignSelf: 'center', marginTop: 16 },
  settingsText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.orange,
    textDecorationLine: 'underline',
  },
  resultBlock: { marginTop: 12 },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  areaBadge: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.orange,
    marginBottom: 10,
  },
  resultEmoji: { fontSize: 48, marginBottom: 6 },
  resultLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.taupe },
  resultMenu: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.brown,
    marginTop: 6,
    textAlign: 'center',
  },
  messageBox: {
    marginTop: 14,
    backgroundColor: colors.cream,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  resultMessage: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.tileText,
    textAlign: 'center',
    lineHeight: 22,
  },
  placesCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 16,
    marginBottom: 20,
  },
  actions: { gap: 14, marginBottom: 8 },
  placesTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
    marginBottom: 12,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.tileBorder,
    paddingVertical: 10,
    gap: 8,
  },
  placeBody: { flex: 1 },
  placeName: { fontFamily: fonts.display, fontSize: 15, color: colors.brown },
  placeMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    marginTop: 4,
  },
  placeAddr: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.taupe,
    marginTop: 4,
    lineHeight: 16,
  },
  placeLink: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.orange,
    marginTop: 2,
  },
  revealPlacesBtn: {
    backgroundColor: homeTileTints.nearby,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  revealPlacesText: { fontFamily: fonts.display, fontSize: 15, color: colors.brown },
  placesHint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.taupe,
    marginTop: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  editLink: { alignSelf: 'center', marginTop: 20 },
  editLinkText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    textDecorationLine: 'underline',
  },
});
