import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mainLogo } from '../assets';
import type { AuthProviderId } from '../api/types';
import { isAuthProviderConfigured } from '../config/auth';
import { useAuthSdkReady } from '../auth/useAuthSdkReady';
import { getAuthErrorMessage, useAuth } from '../context/AuthContext';
import { colors, homeTileTints } from '../theme';
import { fonts } from '../theme/typography';

type SocialRow = {
  id: AuthProviderId;
  label: string;
  emoji: string;
  bg: string;
  fg: string;
  border?: string;
};

const ALL_ROWS: SocialRow[] = [
  {
    id: 'kakao',
    label: '카카오로 시작하기',
    emoji: '💬',
    bg: '#FEE500',
    fg: '#191919',
  },
  {
    id: 'naver',
    label: '네이버로 시작하기',
    emoji: 'N',
    bg: '#03C75A',
    fg: '#FFFFFF',
  },
  {
    id: 'apple',
    label: 'Apple로 계속하기',
    emoji: '',
    bg: '#000000',
    fg: '#FFFFFF',
  },
  {
    id: 'google',
    label: 'Google로 계속하기',
    emoji: 'G',
    bg: '#FFFFFF',
    fg: '#1F1F1F',
    border: colors.tileBorder,
  },
];

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { ready: sdkReady, error: sdkError } = useAuthSdkReady();
  const [busy, setBusy] = useState<AuthProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      ALL_ROWS.filter((row) => row.id !== 'apple' || Platform.OS === 'ios').filter(
        (row) => isAuthProviderConfigured(row.id),
      ),
    [],
  );

  const loginNote = useMemo(() => {
    const ids = new Set(rows.map((row) => row.id));
    if (ids.has('kakao') && ids.has('naver')) {
      return '카카오·네이버 계정으로 빠르게 시작해요.';
    }
    if (ids.has('kakao')) {
      return '카카오 계정으로 빠르게 시작해요.';
    }
    if (ids.has('naver')) {
      return '네이버 계정으로 빠르게 시작해요.';
    }
    return '소셜 계정으로 빠르게 시작해요.';
  }, [rows]);

  const onSocial = async (id: AuthProviderId) => {
    setBusy(id);
    setError(null);
    try {
      await signIn(id);
    } catch (e) {
      setError(getAuthErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.brandBlock}>
          <Image
            source={mainLogo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="메추리"
          />
          <Text style={styles.tagline}>오늘 뭐 먹지? 메추리가 골라줄게요</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>간편 로그인</Text>
          <Text style={styles.note}>{loginNote}</Text>

          {sdkError ? <Text style={styles.error}>{sdkError}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {!sdkReady ? (
            <ActivityIndicator
              color={colors.orange}
              style={styles.sdkLoader}
            />
          ) : null}

          {rows.map((row) => (
            <Pressable
              key={row.id}
              disabled={busy != null || !sdkReady}
              onPress={() => onSocial(row.id)}
              style={({ pressed }) => [
                styles.social,
                {
                  backgroundColor: row.bg,
                  borderWidth: row.border ? 2 : 0,
                  borderColor: row.border ?? 'transparent',
                },
                pressed && styles.pressed,
              ]}>
              {busy === row.id ? (
                <ActivityIndicator color={row.fg} />
              ) : (
                <>
                  {row.emoji ? (
                    <Text
                      style={[
                        styles.socialEmoji,
                        row.id === 'naver' && styles.naverEmoji,
                        { color: row.fg },
                      ]}>
                      {row.emoji}
                    </Text>
                  ) : null}
                  <Text style={[styles.socialLabel, { color: row.fg }]}>
                    {row.label}
                  </Text>
                </>
              )}
            </Pressable>
          ))}

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>또는</Text>
            <View style={styles.divLine} />
          </View>

          <Pressable
            disabled={busy != null || !sdkReady}
            onPress={() => onSocial('guest')}
            style={({ pressed }) => [
              styles.guest,
              pressed && styles.pressed,
            ]}>
            {busy === 'guest' ? (
              <ActivityIndicator color={colors.brown} />
            ) : (
              <Text style={styles.guestLabel}>둘러보기 (게스트)</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 220,
    height: 143,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.taupe,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  block: { marginTop: 4 },
  blockTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.brown,
    marginBottom: 6,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    lineHeight: 20,
    marginBottom: 16,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 12,
  },
  sdkLoader: { marginVertical: 16 },
  social: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 15,
    marginBottom: 10,
  },
  socialEmoji: {
    fontSize: 18,
    fontWeight: '800',
  },
  naverEmoji: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: '900',
  },
  socialLabel: {
    fontFamily: fonts.display,
    fontSize: 16,
  },
  pressed: { opacity: 0.9 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.tileBorder,
  },
  divText: {
    paddingHorizontal: 12,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
  },
  guest: {
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: homeTileTints.recipe,
  },
  guestLabel: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
  },
});
