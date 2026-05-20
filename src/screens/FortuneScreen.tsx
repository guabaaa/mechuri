import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ApiError } from '../api/client';
import { fetchFortune } from '../api/fortuneApi';
import type { FortuneResult } from '../api/types';
import { fortuneIcon, todayFortuneLogo } from '../assets';
import {
  BirthdayDatePicker,
  FeatureActionButton,
  ScreenContainer,
} from '../components';
import type { HomeStackParamList } from '../navigation/types';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { formatTodayLabel, toBirthdayPayload } from '../utils/date';

type Props = NativeStackScreenProps<HomeStackParamList, 'Fortune'>;

const BIRTHDAY_KEY = '@mechuri/birthday';

export default function FortuneScreen({ navigation }: Props) {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(BIRTHDAY_KEY);
      if (saved) {
        const date = new Date(saved);
        if (!Number.isNaN(date.getTime())) {
          setBirthDate(date);
        }
      }
      setLoading(false);
    })();
  }, []);

  const revealFortune = useCallback(async () => {
    if (!birthDate) {
      setError('생년월일을 선택해 주세요.');
      setResult(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const fortune = await fetchFortune(toBirthdayPayload(birthDate));
      await AsyncStorage.setItem(BIRTHDAY_KEY, birthDate.toISOString());
      setResult(fortune);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError(
          '서버에 연결할 수 없어요. yarn server 를 실행해 주세요.',
        );
      }
      setResult(null);
    } finally {
      setSubmitting(false);
    }
  }, [birthDate]);

  return (
    <View style={styles.root}>
      <ScreenContainer contentStyle={styles.screen} resetScrollOnFocus>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← 홈</Text>
        </Pressable>

        <View style={styles.hero}>
          <Image
            source={todayFortuneLogo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="오늘의 운세"
          />
          <Text style={styles.sub}>
            생일을 선택하면 오늘의 운세와{'\n'}행운의 점심 메뉴를 알려드려요
          </Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{formatTodayLabel()}</Text>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>생년월일</Text>
          {loading ? (
            <ActivityIndicator color={colors.orange} style={styles.inputLoader} />
          ) : (
            <BirthdayDatePicker
              value={birthDate}
              onChange={(date) => {
                setBirthDate(date);
                setError(null);
              }}
              disabled={submitting}
            />
          )}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.orange}
            style={styles.loader}
          />
        ) : (
          <FeatureActionButton
            label="운세 보기"
            iconImage={fortuneIcon}
            tint={homeTileTints.fortune}
            loading={submitting}
            disabled={submitting || !birthDate}
            onPress={revealFortune}
          />
        )}

        {result ? (
          <View style={styles.results}>
            <View style={[styles.card, shadows.card]}>
              <Text style={styles.cardKicker}>✦ 오늘의 운세</Text>
              <Text style={styles.headline}>{result.headline}</Text>
              <Text style={styles.body}>{result.body}</Text>
            </View>

            <View style={[styles.card, shadows.card]}>
              <Text style={styles.cardKicker}>🔮 행운 점수</Text>
              <Text style={styles.score}>
                {result.score}
                <Text style={styles.scoreMax}> / 100</Text>
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[styles.barFill, { width: `${result.score}%` }]}
                />
              </View>
              <Text style={styles.caption}>{result.scoreCaption}</Text>
            </View>

            <View style={[styles.card, shadows.card]}>
              <Text style={styles.cardKicker}>🎨 행운의 컬러</Text>
              <View style={styles.colorRow}>
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: result.color.hex },
                  ]}
                />
                <View style={styles.colorTextWrap}>
                  <Text style={styles.colorName}>{result.color.name}</Text>
                  <Text style={styles.colorDesc}>
                    {result.color.description}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.menuSection}>🍽 행운의 메뉴</Text>
            <View style={styles.menuList}>
              {result.menus.map((menu) => (
                <Pressable
                  key={menu.name}
                  onPress={() =>
                    navigation.navigate('Recipe', { menu: menu.name })
                  }
                  style={({ pressed }) => [
                    styles.menuCard,
                    shadows.card,
                    menu.isPick && styles.menuCardPick,
                    pressed && styles.menuCardPressed,
                  ]}>
                  {menu.isPick ? (
                    <View style={styles.pickBadge}>
                      <Image
                        source={fortuneIcon}
                        style={styles.pickBadgeIcon}
                        resizeMode="contain"
                        accessibilityElementsHidden
                      />
                      <Text style={styles.pickBadgeText}>오늘의 픽</Text>
                    </View>
                  ) : null}
                  <Text style={styles.menuEmoji}>{menu.emoji}</Text>
                  <Text style={styles.menuName}>{menu.name}</Text>
                  <Text style={styles.menuDesc}>{menu.description}</Text>
                  <Text style={styles.recipeLink}>레시피 보기 ›</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={[styles.hintCard, shadows.card]}>
            <Text style={styles.hint}>
              생년월일을 고른 뒤 「운세 보기」를 누르면 메추리가 오늘의 운세·행운
              점수·컬러·점심 메뉴를 알려줘요.
            </Text>
          </View>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { paddingBottom: 36 },
  back: { marginTop: 4, marginBottom: 8, alignSelf: 'flex-start' },
  backText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.tileText,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 18,
  },
  logo: {
    width: 280,
    height: 184,
    marginBottom: 8,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 22,
  },
  dateBadge: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  dateBadgeText: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.brown,
  },
  inputCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 16,
    marginBottom: 14,
  },
  inputLabel: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
    marginBottom: 10,
  },
  inputLoader: { marginVertical: 12 },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.red,
    marginTop: 10,
  },
  loader: { marginVertical: 16 },
  results: { marginTop: 24 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 18,
    marginBottom: 14,
  },
  cardKicker: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.orange,
    marginBottom: 10,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.brown,
    lineHeight: 28,
    marginBottom: 10,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.tileText,
  },
  score: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.brown,
  },
  scoreMax: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.taupe,
  },
  barTrack: {
    height: 10,
    backgroundColor: colors.cream,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    marginVertical: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.yellow,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.taupe,
  },
  colorRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  colorTextWrap: { flex: 1 },
  colorName: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.brown,
    marginBottom: 4,
  },
  colorDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.taupe,
  },
  menuSection: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
    marginBottom: 12,
    marginTop: 4,
  },
  menuList: { gap: 12 },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 16,
    alignItems: 'center',
  },
  menuCardPick: {
    backgroundColor: homeTileTints.fortune,
    borderColor: colors.orange,
  },
  menuCardPressed: { opacity: 0.92 },
  recipeLink: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    marginTop: 10,
  },
  pickBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  pickBadgeIcon: {
    width: 14,
    height: 14,
  },
  pickBadgeText: {
    fontFamily: fonts.display,
    fontSize: 11,
    color: colors.brown,
  },
  menuEmoji: { fontSize: 40, marginBottom: 6 },
  menuName: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.brown,
    marginBottom: 6,
  },
  menuDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.taupe,
    textAlign: 'center',
  },
  hintCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 18,
    marginTop: 20,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.taupe,
    textAlign: 'center',
  },
});
