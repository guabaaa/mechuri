import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchNearbyDistricts, fetchNearbyPick } from '../api/nearbyApi';
import type { NearbyDistrict, NearbyMood, NearbyPickResult } from '../api/types';
import { ApiError } from '../api/client';
import {
  FeatureActionButton,
  QuailMascot,
  ScreenContainer,
} from '../components';
import type { MainTabParamList } from '../navigation/types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  loadRecentDistrictIds,
  saveRecentDistrictId,
} from '../storage/recentAreas';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { menuEmoji } from '../utils/menuEmoji';

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
  const [districts, setDistricts] = useState<NearbyDistrict[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [radiusWalkMin, setRadiusWalkMin] = useState<5 | 10 | 15>(10);
  const [mood, setMood] = useState<NearbyMood | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NearbyPickResult | null>(null);
  const [placesRevealed, setPlacesRevealed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [list, recent] = await Promise.all([
          fetchNearbyDistricts(),
          loadRecentDistrictIds(),
        ]);
        setDistricts(list);
        setRecentIds(recent);
        const recentMatch = recent.find((id) =>
          list.some((d) => d.id === id),
        );
        const initial = recentMatch ?? list[0]?.id ?? null;
        setDistrictId(initial);
      } catch (e) {
        setError(
          e instanceof ApiError
            ? e.message
            : '서버에 연결할 수 없어요. yarn server 를 실행해 주세요.',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const runPick = useCallback(
    async (exclude?: string) => {
      if (!districtId) {
        setError('동네를 선택해 주세요.');
        return;
      }
      setSubmitting(true);
      setError(null);
      setPlacesRevealed(false);
      try {
        const picked = await fetchNearbyPick({
          districtId,
          radiusWalkMin,
          mood: mood ?? undefined,
          exclude,
        });
        await saveRecentDistrictId(districtId);
        setRecentIds((prev) => {
          const next = [
            districtId,
            ...prev.filter((id) => id !== districtId),
          ].slice(0, 3);
          return next;
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
    [districtId, mood, radiusWalkMin],
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

  const recentDistricts = recentIds
    .map((id) => districts.find((d) => d.id === id))
    .filter((d): d is NearbyDistrict => d != null);

  if (loading) {
    return (
      <ScreenContainer scroll={false}>
        <ActivityIndicator
          size="large"
          color={colors.orange}
          style={styles.loader}
        />
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

      <View style={styles.hero}>
        <QuailMascot size="md" />
        <Text style={styles.head}>근처에서 먹기</Text>
        <Text style={styles.sub}>
          동네와 도보 거리를 고르면{'\n'}메추리가 메뉴와 가게를 찾아줘요
        </Text>
      </View>

      {!result ? (
        <>
          {recentDistricts.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>최근 동네</Text>
              <View style={styles.chipRow}>
                {recentDistricts.map((d) => (
                  <Pressable
                    key={`recent-${d.id}`}
                    onPress={() => setDistrictId(d.id)}
                    style={[
                      styles.chip,
                      districtId === d.id && styles.chipActive,
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        districtId === d.id && styles.chipTextActive,
                      ]}>
                      {d.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>동네 선택</Text>
            <View style={styles.chipRow}>
              {districts.map((d) => (
                <Pressable
                  key={d.id}
                  onPress={() => setDistrictId(d.id)}
                  style={[
                    styles.chip,
                    districtId === d.id && styles.chipActive,
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      districtId === d.id && styles.chipTextActive,
                    ]}>
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

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
            disabled={submitting || !districtId}
            onPress={() => runPick()}
          />
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
                <View key={place.name} style={styles.placeRow}>
                  <View style={styles.placeBody}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeMeta}>
                      {place.category} · 도보 {place.walkMin}분
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Pressable
                onPress={() => setPlacesRevealed(true)}
                style={styles.revealPlacesBtn}>
                <Text style={styles.revealPlacesText}>
                  가게 목록 보기 👀
                </Text>
              </Pressable>
            )}
            <Text style={styles.placesHint}>
              참고용 추천이에요. 방문 전 지도에서 한번 더 확인해 주세요.
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
  back: { marginTop: 4, marginBottom: 8, alignSelf: 'flex-start' },
  backText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.tileText,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 20,
  },
  head: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.brown,
    marginTop: 10,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: { marginBottom: 18 },
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.brown,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
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
  chipText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.tileText,
  },
  chipTextActive: {
    fontFamily: fonts.display,
    color: colors.brown,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 12,
  },
  resultBlock: { marginTop: 4 },
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
  resultLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
  },
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
  actions: {
    gap: 14,
    marginBottom: 8,
  },
  placesTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
    marginBottom: 12,
  },
  placeRow: {
    borderTopWidth: 1,
    borderTopColor: colors.tileBorder,
    paddingVertical: 10,
  },
  placeBody: { flex: 1 },
  placeName: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
  },
  placeMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    marginTop: 4,
  },
  revealPlacesBtn: {
    backgroundColor: homeTileTints.nearby,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  revealPlacesText: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
  },
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
