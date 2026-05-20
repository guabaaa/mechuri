import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { mechuriAdult, mechuriChick } from '../assets';
import {
  checkInMechuri,
  countAttendanceStreak,
  getMechuriStage,
  isCheckedInToday,
  loadMechuriAttendance,
  STAGE_HINTS,
  STAGE_LABELS,
  type MechuriAttendanceState,
  type MechuriStage,
} from '../storage/mechuriAttendance';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';
import MechuriHatchModal from './MechuriHatchModal';

const STAGE_SIZE: Record<MechuriStage, number> = {
  egg: 0,
  chick: 140,
  adult: 168,
};

type Props = {
  /** 마이페이지 탭 안에서는 상단 제목 중복 방지 */
  hideHeader?: boolean;
};

export default function MechuriAttendanceCard({ hideHeader = false }: Props) {
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [state, setState] = useState<MechuriAttendanceState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [hatchVisible, setHatchVisible] = useState(false);
  const [hatchVariant, setHatchVariant] = useState<'hatch' | 'evolve'>('hatch');

  const reload = useCallback(async () => {
    const data = await loadMechuriAttendance();
    setState(data);
    return data;
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        await reload();
        if (active) {
          setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [reload]),
  );

  const stage = state ? getMechuriStage(state.totalCheckIns) : 'egg';
  const checkedToday = state ? isCheckedInToday(state) : false;
  const streak = state ? countAttendanceStreak(state.checkInDates) : 0;
  const progressToAdult = state
    ? Math.min(state.totalCheckIns, 7)
    : 0;

  const onCheckIn = async () => {
    setChecking(true);
    setMessage(null);
    try {
      const result = await checkInMechuri();
      setState(result.state);

      if (result.alreadyCheckedIn) {
        setMessage('오늘은 이미 출석했어요. 내일 또 만나요!');
        return;
      }

      if (result.justHatched) {
        setHatchVariant('hatch');
        setHatchVisible(true);
        setMessage('첫 출석 완료! 메추리가 태어났어요 🐣');
        return;
      }

      if (result.justEvolved) {
        setHatchVariant('evolve');
        setHatchVisible(true);
        setMessage('7번 출석 달성! 메추리가 다 컸어요 ✨');
        return;
      }

      setMessage(
        `출석 ${result.streak}일 연속! 총 ${result.state.totalCheckIns}번째 출석이에요.`,
      );
    } catch {
      setMessage('출석체크에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <View style={[styles.card, shadows.card]}>
        {hideHeader ? null : (
          <>
            <Text style={styles.cardTitle}>내 메추리 키우기</Text>
            <Text style={styles.cardSub}>매일 출석체크하고 성장시켜요</Text>
          </>
        )}

        {loading ? (
          <ActivityIndicator
            color={colors.orange}
            style={styles.loader}
            size="large"
          />
        ) : (
          <>
            <View style={styles.petArea}>
              {stage === 'egg' ? (
                <View style={styles.eggShell}>
                  <Text style={styles.eggEmoji}>🥚</Text>
                  <Text style={styles.eggWiggle}>흔들흔들...</Text>
                </View>
              ) : (
                <Image
                  source={stage === 'chick' ? mechuriChick : mechuriAdult}
                  style={{
                    width: STAGE_SIZE[stage],
                    height: STAGE_SIZE[stage],
                  }}
                  resizeMode="contain"
                  accessibilityLabel="메추리"
                />
              )}
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.stageBadge}>
                <Text style={styles.stageBadgeText}>{STAGE_LABELS[stage]}</Text>
              </View>
              {streak > 0 ? (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {streak}일 연속</Text>
                </View>
              ) : null}
            </View>

            {stage !== 'adult' ? (
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(progressToAdult / 7) * 100}%` },
                  ]}
                />
              </View>
            ) : null}

            <Text style={styles.hint}>
              {stage !== 'adult'
                ? `성장 ${progressToAdult}/7 · ${STAGE_HINTS[stage]}`
                : STAGE_HINTS[stage]}
            </Text>

            <Pressable
              onPress={onCheckIn}
              disabled={checking || checkedToday}
              style={({ pressed }) => [
                styles.checkBtn,
                checkedToday && styles.checkBtnDone,
                pressed && !checkedToday && styles.checkBtnPressed,
              ]}>
              {checking ? (
                <ActivityIndicator color={colors.brown} size="small" />
              ) : (
                <Text style={styles.checkBtnText}>
                  {checkedToday ? '오늘 출석 완료 ✓' : '출석체크 하기'}
                </Text>
              )}
            </Pressable>

            {message ? <Text style={styles.message}>{message}</Text> : null}
          </>
        )}
      </View>

      <MechuriHatchModal
        visible={hatchVisible}
        variant={hatchVariant}
        onClose={() => setHatchVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.brown,
    alignSelf: 'flex-start',
  },
  cardSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 12,
  },
  loader: { marginVertical: 32 },
  petArea: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  eggShell: {
    width: 130,
    height: 150,
    borderRadius: 65,
    backgroundColor: homeTileTints.mbti,
    borderWidth: 3,
    borderColor: colors.tileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggEmoji: { fontSize: 64 },
  eggWiggle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    marginTop: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  stageBadge: {
    backgroundColor: homeTileTints.meal,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  stageBadgeText: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.brown,
  },
  streakBadge: {
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  streakText: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.brown,
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: colors.cream,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.yellow,
    borderRadius: 5,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  checkBtn: {
    width: '100%',
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  checkBtnDone: {
    backgroundColor: homeTileTints.ladder,
    opacity: 0.9,
  },
  checkBtnPressed: { opacity: 0.92 },
  checkBtnText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.orange,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
});
