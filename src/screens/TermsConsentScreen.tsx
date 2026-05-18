import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { QuailMascot } from '../components';
import { ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  LEGAL_POLICY_VERSION,
  LOCATION_TERMS,
  PRIVACY_POLICY,
  TERMS_OF_SERVICE,
} from '../legal/documents';
import { colors, homeTileTints } from '../theme';
import { fonts } from '../theme/typography';

type DocKey = 'terms' | 'privacy' | 'location';

const DOC_TITLES: Record<DocKey, string> = {
  terms: '서비스 이용약관',
  privacy: '개인정보 처리방침',
  location: '위치기반서비스 이용약관',
};

const DOC_BODIES: Record<DocKey, string> = {
  terms: TERMS_OF_SERVICE,
  privacy: PRIVACY_POLICY,
  location: LOCATION_TERMS,
};

export default function TermsConsentScreen() {
  const insets = useSafeAreaInsets();
  const { submitConsents, signOut } = useAuth();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [location, setLocation] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState<DocKey | null>(null);

  const allChecked = terms && privacy && location;

  const onAgree = async () => {
    if (!allChecked) {
      setError('필수 항목에 모두 동의해 주세요.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await submitConsents();
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : '동의 저장에 실패했어요. 서버 연결을 확인해 주세요.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <QuailMascot size="md" />
          <Text style={styles.title}>약관 동의</Text>
          <Text style={styles.sub}>
            메추리 이용을 위해 아래 약관에 동의해 주세요.{'\n'}
            근처에서 먹기는 위치 정보가 필요해요.
          </Text>
          <Text style={styles.version}>시행 버전 {LEGAL_POLICY_VERSION}</Text>
        </View>

        <CheckRow
          checked={terms}
          onToggle={() => setTerms((v) => !v)}
          label="[필수] 서비스 이용약관 동의"
          onView={() => setDoc('terms')}
        />
        <CheckRow
          checked={privacy}
          onToggle={() => setPrivacy((v) => !v)}
          label="[필수] 개인정보 처리방침 동의"
          onView={() => setDoc('privacy')}
        />
        <CheckRow
          checked={location}
          onToggle={() => setLocation((v) => !v)}
          label="[필수] 위치기반서비스 이용약관 동의"
          onView={() => setDoc('location')}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          disabled={busy || !allChecked}
          onPress={onAgree}
          style={({ pressed }) => [
            styles.agreeBtn,
            (!allChecked || busy) && styles.agreeBtnDisabled,
            pressed && allChecked && styles.pressed,
          ]}>
          <Text style={styles.agreeText}>
            {busy ? '저장 중...' : '동의하고 시작하기'}
          </Text>
        </Pressable>

        <Pressable onPress={() => signOut()} style={styles.logout}>
          <Text style={styles.logoutText}>다른 계정으로 로그인</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={doc != null} animationType="slide" onRequestClose={() => setDoc(null)}>
        <View style={styles.modalSafe}>
          <View
            style={[
              styles.modalHeader,
              { paddingTop: insets.top + 16 },
            ]}>
            <Text style={styles.modalTitle}>{doc ? DOC_TITLES[doc] : ''}</Text>
            <Pressable
              onPress={() => setDoc(null)}
              style={styles.modalCloseBtn}
              hitSlop={8}>
              <Text style={styles.modalClose}>닫기</Text>
            </Pressable>
          </View>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={[
              styles.modalBody,
              { paddingBottom: insets.bottom + 40 },
            ]}>
            <Text style={styles.modalText}>{doc ? DOC_BODIES[doc] : ''}</Text>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function CheckRow({
  checked,
  onToggle,
  label,
  onView,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  onView: () => void;
}) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onToggle} style={styles.checkHit}>
        <View style={[styles.box, checked && styles.boxOn]}>
          {checked ? <Text style={styles.checkMark}>✓</Text> : null}
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </Pressable>
      <Pressable onPress={onView}>
        <Text style={styles.viewLink}>보기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 24, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: 24 },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.brown,
    marginTop: 12,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
  version: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.taupe,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingVertical: 4,
  },
  checkHit: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: homeTileTints.menu, borderColor: colors.orange },
  checkMark: { fontFamily: fonts.display, fontSize: 14, color: colors.brown },
  rowLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.brown,
    flex: 1,
  },
  viewLink: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.orange,
    textDecorationLine: 'underline',
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.red,
    textAlign: 'center',
    marginVertical: 12,
  },
  agreeBtn: {
    backgroundColor: colors.orange,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  agreeBtnDisabled: { opacity: 0.45 },
  agreeText: { fontFamily: fonts.display, fontSize: 16, color: colors.white },
  pressed: { opacity: 0.9 },
  logout: { alignSelf: 'center', marginTop: 20 },
  logoutText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    textDecorationLine: 'underline',
  },
  modalSafe: { flex: 1, backgroundColor: colors.cream },
  modalHeader: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.tileBorder,
  },
  modalTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.brown,
    paddingRight: 8,
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  modalClose: { fontFamily: fonts.body, fontSize: 15, color: colors.orange },
  modalScroll: { flex: 1 },
  modalBody: { padding: 20, paddingBottom: 40 },
  modalText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.tileText,
  },
});
