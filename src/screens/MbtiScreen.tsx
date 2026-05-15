import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ApiError } from '../api/client';
import { fetchMbtiQuestions, fetchMbtiResult } from '../api/mbtiApi';
import type { MbtiQuestionsResponse } from '../api/types';
import { ScreenContainer } from '../components';
import type { HomeStackParamList } from '../navigation/types';
import { colors, shadows } from '../theme';

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
      <ScreenContainer scroll={false}>
        <ActivityIndicator size="large" color={colors.purple} style={styles.loader} />
      </ScreenContainer>
    );
  }

  if (!weekData || !question) {
    return (
      <ScreenContainer>
        <Text style={styles.errorText}>{error ?? '질문을 불러올 수 없습니다.'}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← 홈</Text>
      </Pressable>

      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>🧠 메비티아이</Text>
          </View>
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>{weekData.weekLabel}</Text>
          </View>
        </View>
        <Text style={styles.setTitle}>{weekData.setTitle}</Text>
        <Text style={styles.setDesc}>{weekData.setDescription}</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* 질문 카드 */}
      <View style={[styles.card, shadows.card]}>
        <View style={styles.progressRow}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((step + 1) / questions.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {step + 1} / {questions.length}
          </Text>
        </View>

        <Text style={styles.qTitle}>{question.title}</Text>

        {question.options.map((opt) => (
          <Pressable
            key={opt.id}
            disabled={submitting}
            onPress={() => pick(opt.persona)}
            style={({ pressed }) => [
              styles.opt,
              pressed && styles.optPressed,
              submitting && styles.optDisabled,
            ]}>
            {submitting ? (
              <ActivityIndicator color={colors.brown} />
            ) : (
              <Text style={styles.optText}>{opt.label}</Text>
            )}
          </Pressable>
        ))}
      </View>

      <Text style={styles.hint}>매주 새로운 테스트가 업데이트돼요</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 80 },
  back: { marginTop: 4, marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontSize: 15, fontWeight: '700', color: colors.purple },
  header: { marginBottom: 20 },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  brandBadge: {
    backgroundColor: colors.purple,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  brandBadgeText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  weekBadge: {
    backgroundColor: colors.yellow,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: colors.brown,
  },
  weekBadgeText: { fontSize: 13, fontWeight: '700', color: colors.brown },
  setTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.brown,
    marginBottom: 4,
    lineHeight: 26,
  },
  setDesc: { fontSize: 14, color: colors.taupe, lineHeight: 20 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.brown,
    padding: 20,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EDE4D4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.purple,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.taupe,
    minWidth: 36,
    textAlign: 'right',
  },
  qTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.brown,
    lineHeight: 26,
    marginBottom: 16,
  },
  opt: {
    borderWidth: 2,
    borderColor: colors.brown,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: colors.cream,
    minHeight: 52,
    justifyContent: 'center',
  },
  optPressed: { opacity: 0.85, backgroundColor: colors.yellow },
  optDisabled: { opacity: 0.6 },
  optText: { fontSize: 16, fontWeight: '600', color: colors.brown, lineHeight: 22 },
  errorText: { fontSize: 14, color: colors.red, marginBottom: 12 },
  hint: {
    fontSize: 13,
    color: colors.taupe,
    textAlign: 'center',
    marginTop: 4,
  },
});
