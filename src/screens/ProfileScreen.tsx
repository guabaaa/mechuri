import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ApiError } from '../api/client';
import { mypageMain } from '../assets';
import { ScreenContainer } from '../components';
import { useAuth } from '../context/AuthContext';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';

const PROVIDER_LABEL: Record<string, string> = {
  kakao: '카카오',
  naver: '네이버',
  apple: 'Apple',
  google: 'Google',
  guest: '둘러보기',
};

const NICKNAME_MAX = 12;

function formatJoinedAt(iso?: string) {
  if (!iso) {
    return null;
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function ProfileScreen() {
  const { user, updateNickname, signOut } = useAuth();
  const [draft, setDraft] = useState(user?.nickname ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(user?.nickname ?? '');
  }, [user?.nickname]);

  if (!user) {
    return null;
  }

  const joinedLabel = formatJoinedAt(user.joinedAt);
  const trimmed = draft.trim();
  const canSave =
    trimmed.length >= 2 &&
    trimmed.length <= NICKNAME_MAX &&
    trimmed !== user.nickname &&
    !saving;

  const onSave = async () => {
    if (!canSave) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateNickname(trimmed);
      setMessage('닉네임을 저장했어요.');
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : '닉네임 저장에 실패했어요. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer contentStyle={styles.screen}>
      <Text style={styles.title}>마이페이지</Text>

      <View style={styles.hero}>
        <Image
          source={mypageMain}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="메추리"
        />
        <Text style={styles.displayName}>{user.nickname}</Text>
        <View style={styles.providerBadge}>
          <Text style={styles.providerBadgeText}>
            {PROVIDER_LABEL[user.provider] ?? user.provider} 로그인
          </Text>
        </View>
      </View>

      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardTitle}>프로필 설정</Text>
        <Text style={styles.fieldLabel}>닉네임</Text>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={(t) => {
            setDraft(t);
            setError(null);
            setMessage(null);
          }}
          placeholder="2~12자 닉네임"
          placeholderTextColor={colors.taupe}
          maxLength={NICKNAME_MAX}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!saving}
        />
        <Text style={styles.hint}>
          {trimmed.length}/{NICKNAME_MAX} · 앱에서 보이는 이름이에요
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.success}>{message}</Text> : null}

        <Pressable
          disabled={!canSave}
          onPress={onSave}
          style={({ pressed }) => [
            styles.saveBtn,
            !canSave && styles.saveBtnDisabled,
            pressed && canSave && styles.saveBtnPressed,
          ]}>
          {saving ? (
            <ActivityIndicator color={colors.brown} size="small" />
          ) : (
            <Text style={styles.saveBtnText}>닉네임 저장</Text>
          )}
        </Pressable>
      </View>

      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardTitle}>계정 정보</Text>
        <InfoRow label="로그인" value={PROVIDER_LABEL[user.provider] ?? user.provider} />
        {joinedLabel ? (
          <InfoRow label="함께한 날" value={`${joinedLabel}부터`} />
        ) : null}
        <InfoRow label="계정 ID" value={user.id.slice(-8)} mono />
      </View>

      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardTitle}>메추리 소개</Text>
        <Text style={styles.body}>
          오늘 뭐 먹지? 메추리가 골라줄게요. 점메추를 귀엽고 게임처럼 즐길 수 있는
          점심 메뉴 추천 앱이에요.
        </Text>
      </View>

      <Pressable onPress={() => signOut()} style={styles.logout}>
        <Text style={styles.logoutLabel}>로그아웃</Text>
      </Pressable>
    </ScreenContainer>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, mono && styles.infoMono]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: 40 },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.brown,
    marginTop: 8,
    marginBottom: 4,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 16,
  },
  logo: {
    width: 240,
    height: 156,
    marginBottom: 10,
  },
  displayName: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.brown,
    marginTop: 4,
  },
  providerBadge: {
    marginTop: 10,
    backgroundColor: homeTileTints.mbti,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  providerBadgeText: {
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
    marginBottom: 14,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.brown,
    marginBottom: 8,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.brown,
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    marginTop: 8,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.red,
    marginTop: 10,
  },
  success: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.orange,
    marginTop: 10,
  },
  saveBtn: {
    marginTop: 14,
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnPressed: { opacity: 0.9 },
  saveBtnText: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cream,
  },
  infoLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
  },
  infoValue: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.brown,
    maxWidth: '58%',
    textAlign: 'right',
  },
  infoMono: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.tileText,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.taupe,
  },
  logout: {
    alignSelf: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: colors.red,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  logoutLabel: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.red,
  },
});
