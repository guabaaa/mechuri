import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MBTI_QUESTIONS,
  PERSONA_RESULTS,
  PersonaKey,
  resolvePersona,
} from '../data/mbti';
import { useAppTheme } from '../theme';

export default function MbtiScreen() {
  const theme = useAppTheme();
  const isDark = useColorScheme() === 'dark';
  const [step, setStep] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const question = MBTI_QUESTIONS[step];
  const personaKey = useMemo(() => {
    if (!done) {
      return null;
    }
    return resolvePersona(counts) as PersonaKey;
  }, [counts, done]);

  const result = personaKey ? PERSONA_RESULTS[personaKey] : null;

  const reset = useCallback(() => {
    setStep(0);
    setCounts({});
    setDone(false);
  }, []);

  const pick = useCallback(
    (persona: string) => {
      setCounts((prev) => ({
        ...prev,
        [persona]: (prev[persona] ?? 0) + 1,
      }));
      if (step >= MBTI_QUESTIONS.length - 1) {
        setDone(true);
      } else {
        setStep((s) => s + 1);
      }
    },
    [step],
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.head, { color: theme.text }]}>음식 MBTI</Text>
        <Text style={[styles.sub, { color: theme.sub }]}>
          질문에 답하면 음식 성향과 메뉴를 추천해요. 결과는 친구에게 공유해
          보세요.
        </Text>

        {!done && question ? (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.progress, { color: theme.sub }]}>
              {step + 1} / {MBTI_QUESTIONS.length}
            </Text>
            <Text style={[styles.qTitle, { color: theme.text }]}>
              {question.title}
            </Text>
            {question.options.map((opt) => (
              <Pressable
                key={opt.id}
                onPress={() => pick(opt.persona)}
                style={({ pressed }) => [
                  styles.opt,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.bg,
                  },
                  pressed && { opacity: 0.85 },
                ]}>
                <Text style={[styles.optText, { color: theme.text }]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {done && result ? (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.resultLabel, { color: theme.sub }]}>결과</Text>
            <Text style={[styles.resultTitle, { color: theme.text }]}>
              {result.title}
            </Text>
            <Text style={[styles.resultBody, { color: theme.sub }]}>
              {result.body}
            </Text>
            <Text style={[styles.recLabel, { color: theme.text }]}>
              오늘의 추천 메뉴
            </Text>
            <Text style={[styles.recMenus, { color: theme.accent }]}>
              {result.menus.join(' / ')}
            </Text>
            <Pressable
              onPress={reset}
              style={({ pressed }) => [
                styles.secondary,
                { borderColor: theme.accent },
                pressed && { opacity: 0.85 },
              ]}>
              <Text style={[styles.secondaryLabel, { color: theme.accent }]}>
                다시 테스트하기
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 22, paddingBottom: 40 },
  head: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  progress: { fontSize: 13, marginBottom: 10 },
  qTitle: { fontSize: 18, fontWeight: '700', lineHeight: 26, marginBottom: 16 },
  opt: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  optText: { fontSize: 16, lineHeight: 22 },
  resultLabel: { fontSize: 13, marginBottom: 6 },
  resultTitle: { fontSize: 22, fontWeight: '800', marginBottom: 10 },
  resultBody: { fontSize: 15, lineHeight: 22, marginBottom: 18 },
  recLabel: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  recMenus: { fontSize: 16, fontWeight: '700', marginBottom: 20 },
  secondary: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  secondaryLabel: { fontWeight: '700' },
});
