import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ApiError } from '../api/client';
import { fetchMbtiQuestions, fetchMbtiResult } from '../api/mbtiApi';
import type { MbtiQuestionsResponse } from '../api/types';
import { mebtiPageLogo } from '../assets';
import { ScreenContainer } from '../components';
import type { HomeStackParamList } from '../navigation/types';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<HomeStackParamList, 'MbtiTest'>;

export default function MbtiScreen({ navigation }: Props) {
  const [weekData, setWeekData] = useState<MbtiQuestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMbtiQuestions();
        setWeekData(data);
      } catch (e) {
        setError(
          e instanceof ApiError
            ? e.message
            : '질문을 불러오지 못했어요. API 서버를 확인해 주세요.',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const questions = weekData?.questions ?? [];
  const question = questions[step];
  const progress = questions.length > 0 ? (step + 1) / questions.length : 0;

  const pick = useCallback(
    async (persona: string) => {
      const next = { ...counts, [persona]: (counts[persona] ?? 0) + 1 };
      if (step < questions.length - 1) {
        setCounts(next);
        setStep((s) => s + 1);
        return;
      }
      setSubmitting(true);
      setError(null);
      try {
        const result = await fetchMbtiResult(next);
        navigation.replace('MbtiResult', { result });
      } catch (e) {
        setError(
          e instanceof ApiError ? e.message : '결과를 가져오지 못했어요.',
        );
      } finally {
        setSubmitting(false);
      }
    },
    [counts, navigation, questions.length, step],
  );

  if (loading) {
    return (
      <View style={styles.root}>
        <ScreenContainer scroll={false}>
          <ActivityIndicator
            size="large"
            color={colors.orange}
            style={styles.loader}
          />
        </ScreenContainer>
      </View>
    );
  }

  if (!weekData || !question) {
    return (
      <View style={styles.root}>
        <ScreenContainer resetScrollOnFocus>
          <Text style={styles.errorText}>
            {error ?? '질문을 불러올 수 없습니다.'}
          </Text>
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenContainer contentStyle={styles.screen} resetScrollOnFocus>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← 홈</Text>
        </Pressable>

        <View style={styles.hero}>
          <Image
            source={mebtiPageLogo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="메비티아이"
          />
          <Text style={styles.sub}>
            질문에 답하면 오늘의 음식 성향을{'\n'}메추리가 분석해 드려요
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>{weekData.weekLabel}</Text>
            </View>
            <View style={styles.setBadge}>
              <Text style={styles.setBadgeText} numberOfLines={1}>
                {weekData.setTitle}
              </Text>
            </View>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={[styles.card, shadows.card]}>
          <View style={styles.progressRow}>
            <View style={styles.progressBarTrack}>
              <View
                style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {step + 1}/{questions.length}
            </Text>
          </View>

          <Text style={styles.qKicker}>Q{step + 1}</Text>
          <Text style={styles.qTitle}>{question.title}</Text>

          {question.options.map((opt, i) => (
            <Pressable
              key={opt.id}
              disabled={submitting}
              onPress={() => pick(opt.persona)}
              style={({ pressed }) => [
                styles.opt,
                i === question.options.length - 1 && styles.optLast,
                pressed && styles.optPressed,
                submitting && styles.optDisabled,
              ]}>
              {submitting ? (
                <ActivityIndicator color={colors.brown} size="small" />
              ) : (
                <Text style={styles.optText}>{opt.label}</Text>
              )}
            </Pressable>
          ))}
        </View>

        <Text style={styles.hint}>
          매주 새로운 질문 세트가 바뀌어요 · 16가지 유형 중 하나
        </Text>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
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
    paddingVertical: 4,
    marginBottom: 18,
  },
  logo: {
    width: 220,
    height: 144,
    marginBottom: 6,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 8,
  },
  weekBadge: {
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  weekBadgeText: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.brown,
  },
  setBadge: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '72%',
  },
  setBadgeText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.tileText,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 18,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  progressBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.cream,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.yellow,
    borderRadius: 5,
  },
  progressLabel: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.taupe,
    minWidth: 32,
    textAlign: 'right',
  },
  qKicker: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.orange,
    marginBottom: 6,
  },
  qTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.brown,
    lineHeight: 26,
    marginBottom: 16,
  },
  opt: {
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: homeTileTints.mbti,
    minHeight: 52,
    justifyContent: 'center',
  },
  optLast: { marginBottom: 0 },
  optPressed: {
    opacity: 0.9,
    backgroundColor: colors.yellow,
    borderColor: colors.orange,
  },
  optDisabled: { opacity: 0.55 },
  optText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.brown,
    lineHeight: 22,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.red,
    marginBottom: 12,
    textAlign: 'center',
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 20,
  },
});
