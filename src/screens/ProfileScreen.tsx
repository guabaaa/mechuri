import { Pressable, StyleSheet, Text, View } from 'react-native';
import { QuailMascot, ScreenContainer } from '../components';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

const PROVIDER_LABEL: Record<string, string> = {
  kakao: '카카오',
  naver: '네이버',
  apple: 'Apple',
  google: 'Google',
  guest: '둘러보기',
};

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScreenContainer>
      <Text style={styles.title}>마이페이지</Text>

      <View style={styles.hero}>
        <QuailMascot size="sm" />
        {user ? (
          <>
            <Text style={styles.nickname}>{user.nickname}</Text>
            <Text style={styles.provider}>
              {PROVIDER_LABEL[user.provider] ?? user.provider} 로그인
            </Text>
          </>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>메추리 소개</Text>
        <Text style={styles.body}>
          오늘 뭐 먹지? 메추리가 골라줄게요. 점메추를 귀엽고 게임처럼 즐길 수
          있는 점심 메뉴 추천 앱이에요.
        </Text>
      </View>

      <Pressable onPress={() => signOut()} style={styles.logout}>
        <Text style={styles.logoutLabel}>로그아웃</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '900', color: colors.brown, marginTop: 8 },
  hero: {
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 16,
  },
  nickname: { fontSize: 20, fontWeight: '900', color: colors.brown, marginTop: 12 },
  provider: { fontSize: 14, color: colors.taupe, marginTop: 4 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.brown,
    padding: 18,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.brown, marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22, color: colors.taupe },
  logout: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.red,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  logoutLabel: { fontSize: 16, fontWeight: '800', color: colors.red },
});
