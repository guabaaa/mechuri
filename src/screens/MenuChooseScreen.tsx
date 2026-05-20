import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ApiError } from '../api/client';
import { fetchSituationMenu, fetchSituations } from '../api/menusApi';
import type { SituationSummary } from '../api/types';
import { MenuRevealOverlay, ScreenContainer } from '../components';
import { useMenuReveal, type MenuRevealResult } from '../hooks/useMenuReveal';
import { useResetScrollOnFocus } from '../hooks/useResetScrollOnFocus';
import type { HomeStackParamList } from '../navigation/types';
import {
  colors,
  homeScreenPadding,
  homeTileGap,
  homeTileHeight,
  homeTileTints,
} from '../theme';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<HomeStackParamList, 'MenuChoose'>;

const TILE_TINTS = [
  homeTileTints.menu,
  homeTileTints.mbti,
  homeTileTints.roulette,
  homeTileTints.fortune,
];

export default function MenuChooseScreen({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const tileWidth =
    (screenWidth - homeScreenPadding * 2 - homeTileGap) / 2;
  const { phase, error: revealError, run, finishReveal, isBusy } = useMenuReveal();

  const gridScrollRef = useRef<ScrollView>(null);
  const [situations, setSituations] = useState<SituationSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  useResetScrollOnFocus(gridScrollRef);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchSituations();
        if (!cancelled) {
          setSituations(list);
        }
      } catch (e) {
        if (!cancelled) {
          setListError(
            e instanceof ApiError
              ? e.message
              : '상황 목록을 불러올 수 없어요.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingList(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pickSituation = useCallback(
    async (situation: SituationSummary) => {
      await run(async () => {
        const result = await fetchSituationMenu(situation.id);
        return {
          menu: result.menu,
          message: result.message,
          situationTitle: result.situationTitle,
          situationId: situation.id,
        } satisfies MenuRevealResult;
      });
    },
    [run],
  );

  const onRevealDone = () => {
    finishReveal((result) => {
      navigation.replace('MenuResult', {
        menu: result.menu,
        message: result.message,
        source: 'situation',
        situationId: result.situationId,
        situationTitle: result.situationTitle,
      });
    });
  };

  const rows: SituationSummary[][] = [];
  for (let i = 0; i < situations.length; i += 2) {
    rows.push(situations.slice(i, i + 2));
  }

  return (
    <View style={styles.root}>
      <ScreenContainer scroll={false}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← 뒤로</Text>
        </Pressable>

        <Text style={styles.head}>골라서 뽑기</Text>
        <Text style={styles.sub}>지금 상황에 맞는 메뉴를 추천해 줄게요</Text>

        {listError ? <Text style={styles.error}>{listError}</Text> : null}
        {revealError ? <Text style={styles.error}>{revealError}</Text> : null}

        {loadingList ? (
          <ActivityIndicator
            size="large"
            color={colors.orange}
            style={styles.loader}
          />
        ) : (
          <ScrollView
            ref={gridScrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={[styles.row, { gap: homeTileGap }]}>
                {row.map((item, colIndex) => (
                  <Pressable
                    key={item.id}
                    disabled={isBusy}
                    onPress={() => pickSituation(item)}
                    style={({ pressed }) => [
                      styles.tileOuter,
                      { width: tileWidth, height: homeTileHeight },
                      pressed && styles.tilePressed,
                    ]}>
                    <View
                      style={[
                        styles.tile,
                        {
                          backgroundColor:
                            TILE_TINTS[(rowIndex + colIndex) % TILE_TINTS.length],
                        },
                      ]}>
                      <View style={styles.shine} pointerEvents="none" />
                      <Text style={styles.tileTitle}>{item.title}</Text>
                      <Text style={styles.tileHint}>{item.hint}</Text>
                    </View>
                  </Pressable>
                ))}
                {row.length === 1 ? (
                  <View style={{ width: tileWidth }} />
                ) : null}
              </View>
            ))}
          </ScrollView>
        )}
      </ScreenContainer>

      {phase === 'reveal' ? (
        <MenuRevealOverlay
          onComplete={onRevealDone}
          title="상황에 맞게 고르는 중..."
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { marginTop: 4, marginBottom: 8, alignSelf: 'flex-start' },
  backText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.tileText,
  },
  head: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.brown,
    marginBottom: 6,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginBottom: 16,
  },
  loader: { marginTop: 40 },
  grid: { gap: homeTileGap, paddingBottom: 24 },
  row: { flexDirection: 'row', width: '100%' },
  tileOuter: {
    shadowColor: colors.tileShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.85,
    shadowRadius: 8,
    elevation: 3,
  },
  tilePressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  tile: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 8,
    left: 10,
    right: 10,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
  },
  tileTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 21,
    color: colors.tileText,
  },
  tileHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    marginTop: 6,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    marginBottom: 12,
  },
});
