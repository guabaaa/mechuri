import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, QuailMascot, ScreenContainer } from '../components';
import type { HomeStackParamList } from '../navigation/types';
import { colors, shadows } from '../theme';
import { menuEmoji } from '../utils/menuEmoji';

type Props = NativeStackScreenProps<HomeStackParamList, 'MbtiResult'>;

export default function MbtiResultScreen({ navigation, route }: Props) {
  const { result } = route.params;
  return (
    <ScreenContainer>
      <Text style={styles.kicker}>메비티아이 테스트 결과</Text>
      <Text style={styles.title}>당신은 {result.title}</Text>

      <View style={styles.hero}>
        <QuailMascot size="md" />
      </View>

      <Text style={styles.body}>{result.body}</Text>

      <Text style={styles.section}>추천 메뉴 TOP 3</Text>
      <View style={styles.top3}>
        {result.menus.map((menu, i) => (
          <Pressable
            key={menu}
            onPress={() => navigation.navigate('Recipe', { menu })}
            style={({ pressed }) => [
              styles.menuCard,
              shadows.tile,
              pressed && styles.menuCardPressed,
            ]}>
            <Text style={styles.rank}>#{i + 1}</Text>
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
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontSize: 14,
    color: colors.taupe,
    fontWeight: '600',
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.brown,
    marginBottom: 16,
    lineHeight: 32,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  body: { fontSize: 15, lineHeight: 22, color: colors.taupe, marginBottom: 20 },
  section: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.brown,
    marginBottom: 12,
  },
  top3: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  menuCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.brown,
    padding: 12,
    alignItems: 'center',
  },
  rank: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.orange,
    marginBottom: 4,
  },
  menuEmoji: { fontSize: 28, marginBottom: 6 },
  menuLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.brown,
    textAlign: 'center',
  },
  menuCardPressed: { opacity: 0.9 },
  recipeHint: {
    fontSize: 10,
    color: colors.taupe,
    marginTop: 6,
  },
});
