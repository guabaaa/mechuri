import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, QuailMascot, ScreenContainer } from '../components';
import type { HomeStackParamList } from '../navigation/types';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { menuEmoji } from '../utils/menuEmoji';

type Props = NativeStackScreenProps<HomeStackParamList, 'MbtiResult'>;

export default function MbtiResultScreen({ navigation, route }: Props) {
  const { result } = route.params;
  return (
    <View style={styles.root}>
      <ScreenContainer contentStyle={styles.screen}>
        <View style={styles.hero}>
          <QuailMascot size="sm" />
          <Text style={styles.kicker}>메비티아이 결과</Text>
        </View>

        <View style={[styles.resultCard, shadows.card]}>
          <Text style={styles.emoji}>{result.emoji}</Text>
          <Text style={styles.subtitle}>{result.subtitle}</Text>
          <Text style={styles.title}>{result.title}</Text>
          <Text style={styles.body}>{result.body}</Text>

          <View style={styles.traitRow}>
            {result.traits.map((trait) => (
              <View key={trait} style={styles.traitChip}>
                <Text style={styles.traitText}>{trait}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.tipCard, shadows.card]}>
          <Text style={styles.tipLabel}>✨ 메추리의 한 마디</Text>
          <Text style={styles.tipBody}>{result.mechuriTip}</Text>
        </View>

        <Text style={styles.section}>추천 메뉴 TOP 3</Text>
        <View style={styles.menuList}>
          {result.menus.map((menu, i) => (
            <Pressable
              key={menu}
              onPress={() => navigation.navigate('Recipe', { menu })}
              style={({ pressed }) => [
                styles.menuCard,
                shadows.tile,
                i === 0 && styles.menuCardPick,
                pressed && styles.menuCardPressed,
              ]}>
              {i === 0 ? (
                <View style={styles.pickBadge}>
                  <Text style={styles.pickBadgeText}>오늘의 픽</Text>
                </View>
              ) : (
                <Text style={styles.rank}>#{i + 1}</Text>
              )}
              <Text style={styles.menuEmoji}>{menuEmoji(menu)}</Text>
              <Text style={styles.menuLabel}>{menu}</Text>
              <Text style={styles.recipeHint}>레시피 보기 ›</Text>
            </Pressable>
          ))}
        </View>

        <PrimaryButton
          label="테스트 다시하기"
          variant="outline"
          onPress={() => {
            navigation.popToTop();
            navigation.navigate('MbtiTest');
          }}
        />
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  screen: { paddingBottom: 40 },
  hero: {
    alignItems: 'center',
    marginBottom: 12,
  },
  kicker: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.orange,
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  emoji: { fontSize: 52, marginBottom: 8 },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.brown,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 12,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.tileText,
    textAlign: 'center',
  },
  traitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  traitChip: {
    backgroundColor: homeTileTints.mbti,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  traitText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.brown,
  },
  tipCard: {
    backgroundColor: homeTileTints.mbti,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 16,
    marginBottom: 20,
  },
  tipLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.orange,
    marginBottom: 8,
  },
  tipBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.brown,
  },
  section: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
    marginBottom: 12,
  },
  menuList: { gap: 12, marginBottom: 16 },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 16,
    alignItems: 'center',
  },
  menuCardPick: {
    backgroundColor: homeTileTints.mbti,
    borderColor: colors.orange,
  },
  menuCardPressed: { opacity: 0.92 },
  pickBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  pickBadgeText: {
    fontFamily: fonts.display,
    fontSize: 11,
    color: colors.brown,
  },
  rank: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.orange,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  menuEmoji: { fontSize: 36, marginBottom: 6 },
  menuLabel: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.brown,
    marginBottom: 4,
  },
  recipeHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    marginTop: 4,
  },
});
