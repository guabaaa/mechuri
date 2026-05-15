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
import { ALL_MENUS, pickRandom, TODAY_MESSAGES } from '../data/menus';
import { useAppTheme } from '../theme';

export default function TodayScreen() {
  const theme = useAppTheme();
  const isDark = useColorScheme() === 'dark';
  const [menu, setMenu] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>('');

  const recommend = useCallback(() => {
    setMenu((prev) => pickRandom(ALL_MENUS, prev ?? undefined));
    setMsg(TODAY_MESSAGES[Math.floor(Math.random() * TODAY_MESSAGES.length)]!);
  }, []);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.brand, { color: theme.sub }]}>메뉴추천리스트</Text>
        <Text style={[styles.title, { color: theme.text }]}>메추리</Text>
        <Text style={[styles.tagline, { color: theme.sub }]}>
          매일 뭐 먹을지 고민하는 직장인과 자영업자를 위해, 심리테스트·운세·게임
          방식으로 오늘의 메뉴를 추천해요.
        </Text>

        <Text style={[styles.section, { color: theme.text }]}>
          오늘의 메뉴 추천
        </Text>
        <Text style={[styles.desc, { color: theme.sub }]}>
          버튼 한 번이면 오늘의 한 끼를 골라 드릴게요.
        </Text>

        <Pressable
          onPress={recommend}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.accent },
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.buttonLabel, { color: '#fff' }]}>
            오늘의 메뉴 받기
          </Text>
        </Pressable>

        {menu != null ? (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                shadowColor: theme.text,
              },
            ]}>
            <Text style={[styles.cardKicker, { color: theme.sub }]}>
              오늘의 추천 메뉴
            </Text>
            <Text style={[styles.menuName, { color: theme.text }]}>{menu}</Text>
            <Text style={[styles.cardMsg, { color: theme.sub }]}>{msg}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingBottom: 32, paddingTop: 8 },
  brand: { fontSize: 13, letterSpacing: 1.2, marginBottom: 4 },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 10 },
  tagline: { fontSize: 15, lineHeight: 22, marginBottom: 28 },
  section: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  desc: { fontSize: 15, lineHeight: 22, marginBottom: 18 },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  pressed: { opacity: 0.9 },
  buttonLabel: { fontSize: 16, fontWeight: '700' },
  card: {
    marginTop: 22,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardKicker: { fontSize: 13, marginBottom: 6 },
  menuName: { fontSize: 26, fontWeight: '800', marginBottom: 10 },
  cardMsg: { fontSize: 15, lineHeight: 22 },
});
