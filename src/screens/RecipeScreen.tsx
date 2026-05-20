import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ApiError } from '../api/client';
import { fetchRecipe } from '../api/recipeApi';
import type { Recipe } from '../api/types';
import { QuailMascot, ScreenContainer } from '../components';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { menuEmoji } from '../utils/menuEmoji';

type Props = {
  navigation: { goBack: () => void };
  route: { params: { menu: string } };
};

export default function RecipeScreen({ navigation, route }: Props) {
  const { menu } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecipe(menu);
      setRecipe(data);
    } catch (e) {
      setRecipe(null);
      setError(
        e instanceof ApiError
          ? e.message
          : '레시피를 불러올 수 없어요. yarn server 를 실행해 주세요.',
      );
    } finally {
      setLoading(false);
    }
  }, [menu]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScreenContainer resetScrollOnFocus>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← 뒤로</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.orange}
          style={styles.loader}
        />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={load} style={styles.retry}>
            <Text style={styles.retryText}>다시 시도</Text>
          </Pressable>
        </View>
      ) : recipe ? (
        <>
          <View style={styles.hero}>
            <QuailMascot size="sm" />
            <Text style={styles.emoji}>{menuEmoji(recipe.menu)}</Text>
            <Text style={styles.title}>{recipe.menu}</Text>
            <Text style={styles.summary}>{recipe.summary}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>⏱ 약 {recipe.prepMinutes}분</Text>
              <Text style={styles.meta}>🍽 {recipe.servings}인분</Text>
            </View>
          </View>

          <View style={[styles.card, shadows.card]}>
            <Text style={styles.sectionTitle}>재료</Text>
            {recipe.ingredients.map((item) => (
              <Text key={item} style={styles.listItem}>
                · {item}
              </Text>
            ))}
          </View>

          <View style={[styles.card, shadows.card]}>
            <Text style={styles.sectionTitle}>만드는 법</Text>
            {recipe.steps.map((step, i) => (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {recipe.tip ? (
            <View style={[styles.tipCard, shadows.card]}>
              <Text style={styles.tipLabel}>💡 메추리 팁</Text>
              <Text style={styles.tipText}>{recipe.tip}</Text>
            </View>
          ) : null}
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: 4, marginBottom: 8, alignSelf: 'flex-start' },
  backText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.tileText,
  },
  loader: { marginTop: 48 },
  errorBox: { alignItems: 'center', paddingTop: 40 },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 16,
  },
  retry: {
    backgroundColor: homeTileTints.recipe,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.brown,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: { fontSize: 44, marginTop: 8 },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.brown,
    marginTop: 8,
    textAlign: 'center',
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.tileText,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
    marginBottom: 12,
  },
  listItem: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.tileText,
    lineHeight: 22,
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: homeTileTints.recipe,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.brown,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.tileText,
    lineHeight: 22,
  },
  tipCard: {
    backgroundColor: colors.yellow,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 16,
    marginBottom: 24,
  },
  tipLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.brown,
    marginBottom: 6,
  },
  tipText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.tileText,
    lineHeight: 22,
  },
});
