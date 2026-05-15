import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  FeatureActionButton,
  LadderBoard,
  QuailMascot,
  ScreenContainer,
} from '../components';
import type { HomeStackParamList } from '../navigation/types';
import {
  DEFAULT_LADDER_MENUS,
  loadLadderMenus,
  saveLadderMenus,
} from '../storage/ladderMenus';
import { colors, homeTileTints } from '../theme';
import { fonts } from '../theme/typography';
import { buildLadder, winnerMenu, type LadderLayout } from '../utils/ladderGame';
import { menuEmoji } from '../utils/menuEmoji';

type Props = NativeStackScreenProps<HomeStackParamList, 'Ladder'>;

type Phase = 'edit' | 'playing' | 'result';

const MAX_ITEMS = 10;
const MIN_ITEMS = 2;
const ROW_MS = 280;

export default function LadderScreen({ navigation }: Props) {
  const [menus, setMenus] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>('edit');
  const [layout, setLayout] = useState<LadderLayout | null>(null);
  const [activeRow, setActiveRow] = useState(-1);
  const [result, setResult] = useState<{ menu: string; message: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      const list = await loadLadderMenus();
      setMenus(list);
      setLoading(false);
    })();
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const persistMenus = useCallback(async (next: string[]) => {
    setMenus(next);
    try {
      await saveLadderMenus(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했어요.');
    }
  }, []);

  const addMenu = useCallback(() => {
    const name = draft.trim();
    if (!name) {
      return;
    }
    if (menus.length >= MAX_ITEMS) {
      setError(`메뉴는 최대 ${MAX_ITEMS}개까지예요.`);
      return;
    }
    if (menus.includes(name)) {
      setError('이미 있는 메뉴예요.');
      return;
    }
    setDraft('');
    persistMenus([...menus, name]);
  }, [draft, menus, persistMenus]);

  const removeMenu = useCallback(
    (name: string) => {
      if (menus.length <= MIN_ITEMS) {
        setError(`메뉴는 최소 ${MIN_ITEMS}개는 남겨야 해요.`);
        return;
      }
      persistMenus(menus.filter((m) => m !== name));
    },
    [menus, persistMenus],
  );

  const resetDefaults = useCallback(() => {
    persistMenus([...DEFAULT_LADDER_MENUS]);
  }, [persistMenus]);

  const startLadderAnimation = useCallback(
    (nextLayout: LadderLayout) => {
      stopTimer();
      setLayout(nextLayout);
      setResult(null);
      setPhase('playing');
      setActiveRow(-1);

      let row = -1;
      timerRef.current = setInterval(() => {
        row += 1;
        setActiveRow(row);
        if (row >= nextLayout.rows) {
          stopTimer();
          const menu = winnerMenu(nextLayout);
          const message = '사다리타기로 정해진 오늘의 메뉴예요!';
          setResult({ menu, message });
          setPhase('result');
        }
      }, ROW_MS);
    },
    [stopTimer],
  );

  const runLadder = useCallback(() => {
    if (menus.length < MIN_ITEMS) {
      setError(`메뉴를 ${MIN_ITEMS}개 이상 넣어 주세요.`);
      return;
    }
    setError(null);
    startLadderAnimation(buildLadder(menus));
  }, [menus, startLadderAnimation]);

  const editMenus = useCallback(() => {
    stopTimer();
    setLayout(null);
    setResult(null);
    setActiveRow(-1);
    setPhase('edit');
  }, [stopTimer]);

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
    <View style={styles.root}>
      <ScreenContainer contentStyle={styles.screen}>
        <Pressable
          onPress={() => {
            if (phase === 'playing') {
              return;
            }
            navigation.goBack();
          }}
          style={styles.back}
          disabled={phase === 'playing'}>
          <Text
            style={[
              styles.backText,
              phase === 'playing' && styles.backTextDisabled,
            ]}>
            ← 홈
          </Text>
        </Pressable>

        <View style={styles.hero}>
          <QuailMascot size="sm" />
          <Text style={styles.head}>메뉴 사다리타기</Text>
          <Text style={styles.sub}>
            {phase === 'edit'
              ? '후보 메뉴를 직접 넣고, 사다리로 한 끼를 정해요'
              : phase === 'playing'
                ? '사다리를 따라 내려가는 중이에요...'
                : '오늘의 메뉴가 정해졌어요!'}
          </Text>
        </View>

        {phase === 'edit' ? (
          <>
            <View style={styles.inputRow}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="메뉴 이름 입력"
                placeholderTextColor={colors.taupe}
                style={styles.input}
                maxLength={20}
                onSubmitEditing={addMenu}
                returnKeyType="done"
              />
              <Pressable onPress={addMenu} style={styles.addBtn}>
                <Text style={styles.addBtnText}>추가</Text>
              </Pressable>
            </View>

            <View style={styles.menuList}>
              {menus.map((name) => (
                <View key={name} style={styles.menuChip}>
                  <Text style={styles.menuChipText}>{name}</Text>
                  <Pressable
                    onPress={() => removeMenu(name)}
                    hitSlop={8}
                    style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>

            <Pressable onPress={resetDefaults} style={styles.resetLink}>
              <Text style={styles.resetLinkText}>기본 메뉴로 되돌리기</Text>
            </Pressable>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <FeatureActionButton
              label="사다리 타기!"
              icon="🪜"
              tint={homeTileTints.ladder}
              onPress={runLadder}
            />
          </>
        ) : (
          <>
            <View style={styles.ladderWrap}>
              {layout ? (
                <LadderBoard
                  layout={layout}
                  activeRow={activeRow}
                  revealWinner={phase === 'result'}
                />
              ) : null}
            </View>

            {phase === 'playing' ? (
              <Text style={styles.runningHint}>사다리를 타는 중...</Text>
            ) : null}

            {phase === 'result' && result ? (
              <View style={styles.resultSection}>
                <Text style={styles.resultBadge}>🪜 사다리타기 결과</Text>

                <View style={styles.resultCard}>
                  <Text style={styles.resultEmoji}>{menuEmoji(result.menu)}</Text>
                  <Text style={styles.resultLabel}>오늘 이거 어때요?</Text>
                  <Text style={styles.resultMenu}>{result.menu}</Text>
                  <View style={styles.resultMessageBox}>
                    <Text style={styles.resultMessage}>{result.message}</Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <FeatureActionButton
                    label="다시 사다리 타기"
                    icon="🪜"
                    tint={homeTileTints.ladder}
                    onPress={runLadder}
                  />

                  <FeatureActionButton
                    label="레시피 보기"
                    icon="📖"
                    tint={homeTileTints.recipe}
                    onPress={() =>
                      navigation.navigate('Recipe', { menu: result.menu })
                    }
                  />
                </View>

                <Pressable onPress={editMenus} style={styles.editLink}>
                  <Text style={styles.editLinkText}>메뉴 목록 수정하기</Text>
                </Pressable>
              </View>
            ) : null}
          </>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { paddingBottom: 32 },
  loader: { marginTop: 80 },
  back: { marginTop: 4, marginBottom: 8, alignSelf: 'flex-start' },
  backText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.tileText,
  },
  backTextDisabled: { opacity: 0.35 },
  hero: {
    alignItems: 'center',
    marginBottom: 16,
  },
  head: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.brown,
    marginTop: 8,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.brown,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  addBtn: {
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  addBtnText: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
  },
  menuList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  menuChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 4,
  },
  menuChipText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.tileText,
  },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontSize: 16,
    color: colors.taupe,
    lineHeight: 18,
  },
  resetLink: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  resetLinkText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    textDecorationLine: 'underline',
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 12,
  },
  ladderWrap: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  runningHint: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  resultSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: colors.tileBorder,
  },
  resultBadge: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
    textAlign: 'center',
    marginBottom: 14,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  actions: {
    gap: 14,
    marginBottom: 8,
  },
  resultEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  resultLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
  },
  resultMenu: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.brown,
    marginTop: 6,
    textAlign: 'center',
  },
  resultMessageBox: {
    marginTop: 16,
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
  editLink: {
    alignSelf: 'center',
    marginTop: 20,
  },
  editLinkText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    textDecorationLine: 'underline',
  },
});
