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
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../theme';

const PROVIDER_LABEL: Record<string, string> = {
  kakao: '카카오',
  naver: '네이버',
  apple: 'Apple',
  google: 'Google',
  guest: '둘러보기',
};

export default function ProfileScreen() {
  const theme = useAppTheme();
  const isDark = useColorScheme() === 'dark';
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.head, { color: theme.text }]}>내 정보</Text>
        {user ? (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Text style={[styles.label, { color: theme.sub }]}>닉네임</Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {user.nickname}
            </Text>
            <Text style={[styles.label, { color: theme.sub, marginTop: 14 }]}>
              로그인 방식
            </Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {PROVIDER_LABEL[user.provider] ?? user.provider}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.section, { color: theme.text }]}>메뉴추천리스트</Text>
        <Text style={[styles.body, { color: theme.sub }]}>
          매일 뭐 먹을지 고민하는 직장인과 자영업자를 위해, 심리테스트·운세·게임
          방식으로 오늘의 메뉴를 추천해주는 음식 선택 앱, 메추리예요.
        </Text>

        <Pressable
          onPress={() => signOut()}
          style={({ pressed }) => [
            styles.logout,
            { borderColor: theme.danger },
            pressed && { opacity: 0.85 },
          ]}>
          <Text style={[styles.logoutLabel, { color: theme.danger }]}>
            로그아웃
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 22, paddingBottom: 40 },
  head: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 24,
  },
  label: { fontSize: 13, marginBottom: 4 },
  value: { fontSize: 18, fontWeight: '700' },
  section: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22, marginBottom: 28 },
  logout: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  logoutLabel: { fontWeight: '700', fontSize: 16 },
});
