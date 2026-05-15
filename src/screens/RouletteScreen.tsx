import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ALL_MENUS } from '../data/menus';
import { useAppTheme } from '../theme';

const ROULETTE_POOL = ALL_MENUS.slice(0, 18);

export default function RouletteScreen() {
  const theme = useAppTheme();
  const isDark = useColorScheme() === 'dark';
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<string | null>(null);
  const spin = useRef(new Animated.Value(0)).current;

  const pool = useMemo(
    () => ROULETTE_POOL.filter((m) => !excluded.has(m)),
    [excluded],
  );

  const toggle = useCallback((name: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
    setResult(null);
  }, []);

  const spinWheel = useCallback(() => {
    const choices = pool.length > 0 ? pool : [...ROULETTE_POOL];
    const picked = choices[Math.floor(Math.random() * choices.length)]!;
    spin.setValue(0);
    Animated.timing(spin, {
      toValue: 1,
      duration: 2200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setResult(picked));
  }, [pool, spin]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1080deg'],
  });

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.head, { color: theme.text }]}>메뉴 룰렛</Text>
        <Text style={[styles.sub, { color: theme.sub }]}>
          팀 점심 정할 때: 먹기 싫은 메뉴를 빼고 돌려보세요. (이후 투표·사다리
          등도 붙일 수 있어요.)
        </Text>

        <Animated.View
          style={[
            styles.wheelWrap,
            { borderColor: theme.accent },
            { transform: [{ rotate: rotation }] },
          ]}>
          <Text style={[styles.wheelText, { color: theme.text }]}>🍽</Text>
        </Animated.View>

        <Pressable
          onPress={spinWheel}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.accent },
            pressed && { opacity: 0.9 },
          ]}>
          <Text style={styles.buttonLabel}>룰렛 돌리기</Text>
        </Pressable>

        {result ? (
          <View
            style={[
              styles.result,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Text style={[styles.resultLabel, { color: theme.sub }]}>결과</Text>
            <Text style={[styles.resultMenu, { color: theme.text }]}>
              {result}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.section, { color: theme.text }]}>
          제외할 메뉴 (탭하면 토글)
        </Text>
        <View style={styles.chips}>
          {ROULETTE_POOL.map((m) => {
            const on = excluded.has(m);
            return (
              <Pressable
                key={m}
                onPress={() => toggle(m)}
                style={[
                  styles.chip,
                  {
                    borderColor: theme.border,
                    backgroundColor: on ? theme.border : theme.card,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    { color: on ? theme.sub : theme.text },
                    on && styles.chipTextStrike,
                  ]}>
                  {m}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 22, paddingBottom: 48 },
  head: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  wheelWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  wheelText: { fontSize: 48 },
  button: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonLabel: { color: '#fff', fontSize: 16, fontWeight: '700' },
  result: {
    alignSelf: 'stretch',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  resultLabel: { fontSize: 13, marginBottom: 4 },
  resultMenu: { fontSize: 22, fontWeight: '800' },
  section: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  chipTextStrike: { textDecorationLine: 'line-through' },
});
