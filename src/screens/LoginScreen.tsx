import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProviderId, useAuth } from '../context/AuthContext';
import { useAppTheme } from '../theme';

type SocialRow = {
  id: AuthProviderId;
  label: string;
  sub?: string;
  bg: keyof Pick<
    ReturnType<typeof useAppTheme>,
    'kakao' | 'naver' | 'apple' | 'googleBg'
  >;
  fg: 'dark' | 'light';
};

const ROWS: SocialRow[] = [
  { id: 'kakao', label: '카카오로 시작하기', bg: 'kakao', fg: 'dark' },
  { id: 'naver', label: '네이버로 시작하기', bg: 'naver', fg: 'light' },
  { id: 'apple', label: 'Apple로 계속하기', bg: 'apple', fg: 'light' },
  {
    id: 'google',
    label: 'Google로 계속하기',
    bg: 'googleBg',
    fg: 'dark',
  },
];

export default function LoginScreen() {
  const theme = useAppTheme();
  const { signIn } = useAuth();
  const [busy, setBusy] = useState<AuthProviderId | null>(null);

  const onSocial = async (id: AuthProviderId) => {
    setBusy(id);
    try {
      await signIn(id);
    } finally {
      setBusy(null);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.brand, { color: theme.sub }]}>메뉴추천리스트</Text>
        <Text style={[styles.logo, { color: theme.text }]}>메추리</Text>
        <Text style={[styles.tagline, { color: theme.sub }]}>
          오늘 뭐 먹지? 메추리가 골라줄게요
        </Text>

        <View style={styles.block}>
          <Text style={[styles.blockTitle, { color: theme.text }]}>
            간편 로그인
          </Text>
          <Text style={[styles.note, { color: theme.sub }]}>
            아래 버튼은 UI·저장 플로우용이에요. 실제 서비스에서는 각 SDK로
            토큰·프로필을 받아오면 됩니다.
          </Text>
          {ROWS.map((row) => {
            const bg = theme[row.bg];
            const fg =
              row.fg === 'dark' ? theme.googleText : row.id === 'apple' ? '#fff' : '#fff';
            return (
              <Pressable
                key={row.id}
                disabled={busy != null}
                onPress={() => onSocial(row.id)}
                style={({ pressed }) => [
                  styles.social,
                  { backgroundColor: bg },
                  pressed && styles.pressed,
                ]}>
                {busy === row.id ? (
                  <ActivityIndicator color={fg} />
                ) : (
                  <Text style={[styles.socialLabel, { color: fg }]}>
                    {row.label}
                  </Text>
                )}
              </Pressable>
            );
          })}

          <View style={[styles.divider, { borderColor: theme.border }]}>
            <View style={[styles.divLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.divText, { color: theme.sub }]}>또는</Text>
            <View style={[styles.divLine, { backgroundColor: theme.border }]} />
          </View>

          <Pressable
            disabled={busy != null}
            onPress={() => onSocial('guest')}
            style={({ pressed }) => [
              styles.guest,
              { borderColor: theme.accent },
              pressed && { opacity: 0.88 },
            ]}>
            {busy === 'guest' ? (
              <ActivityIndicator color={theme.accent} />
            ) : (
              <Text style={[styles.guestLabel, { color: theme.accent }]}>
                둘러보기 (게스트)
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  brand: { fontSize: 13, letterSpacing: 1.2, marginBottom: 6 },
  logo: { fontSize: 40, fontWeight: '900', marginBottom: 12 },
  tagline: { fontSize: 15, lineHeight: 22, marginBottom: 32 },
  block: { marginTop: 8 },
  blockTitle: { fontSize: 17, fontWeight: '800', marginBottom: 8 },
  note: { fontSize: 12, lineHeight: 18, marginBottom: 16 },
  social: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  socialLabel: { fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.92 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  divLine: { flex: 1, height: 1 },
  divText: { paddingHorizontal: 12, fontSize: 13 },
  guest: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  guestLabel: { fontSize: 16, fontWeight: '700' },
});
