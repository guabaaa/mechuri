import { useCallback, useState } from 'react';
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
import { rollFortune } from '../data/fortune';
import { useAppTheme } from '../theme';

export default function FortuneScreen() {
  const theme = useAppTheme();
  const isDark = useColorScheme() === 'dark';
  const [data, setData] = useState<ReturnType<typeof rollFortune> | null>(null);

  const draw = useCallback(() => {
    setData(rollFortune());
  }, []);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.head, { color: theme.text }]}>음식 운세</Text>
        <Text style={[styles.sub, { color: theme.sub }]}>
          오늘의 운세처럼 메뉴와 행운의 색을 뽑아볼게요.
        </Text>

        <Pressable
          onPress={draw}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.accent },
            pressed && { opacity: 0.9 },
          ]}>
          <Text style={styles.buttonLabel}>운세 뽑기</Text>
        </Pressable>

        {data ? (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Text style={[styles.score, { color: theme.text }]}>
              오늘의 음식 운세 점수:{' '}
              <Text style={{ color: theme.accent }}>{data.score}점</Text>
            </Text>
            <Text style={[styles.row, { color: theme.sub }]}>
              행운의 색:{' '}
              <Text style={{ color: theme.text, fontWeight: '700' }}>
                {data.color.name}
              </Text>
            </Text>
            <Text style={[styles.row, { color: theme.sub }]}>
              행운의 메뉴:{' '}
              <Text style={{ color: theme.text, fontWeight: '700' }}>
                {data.luckyMenu}
              </Text>
            </Text>
            <Text style={[styles.hint, { color: theme.sub }]}>
              피하면 좋은 힌트: {data.color.avoidHint}
            </Text>
            <Text style={[styles.palette, { color: theme.text }]}>
              이 색과 어울리는 메뉴: {data.color.menus.join(', ')}
            </Text>
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
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonLabel: { color: '#fff', fontSize: 16, fontWeight: '700' },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  score: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  row: { fontSize: 16, marginBottom: 8 },
  hint: { fontSize: 14, lineHeight: 20, marginTop: 12 },
  palette: { fontSize: 14, lineHeight: 20, marginTop: 10 },
});
