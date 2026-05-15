import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ApiError } from '../api/client';
import { fetchRecipeList } from '../api/recipeApi';
import type { RecipeSummary } from '../api/types';
import { QuailMascot, ScreenContainer } from '../components';
import type { RecipeStackParamList } from '../navigation/types';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { menuEmoji } from '../utils/menuEmoji';

export default function RecipeListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RecipeStackParamList>>();
  const [list, setList] = useState<RecipeSummary[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecipeList();
      setList(data);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : '서버에 연결할 수 없어요. yarn server 를 실행해 주세요.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) {
      return list;
    }
    return list.filter((item) => item.menu.includes(q));
  }, [list, query]);

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <QuailMascot size="sm" />
        <Text style={styles.head}>레시피</Text>
        <Text style={styles.sub}>메뉴 이름으로 만드는 법을 찾아보세요</Text>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="메뉴 검색 (예: 김치찌개)"
        placeholderTextColor={colors.taupe}
        style={styles.search}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.orange}
          style={styles.loader}
        />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        filtered.map((item) => (
          <Pressable
            key={item.menu}
            onPress={() =>
              navigation.navigate('RecipeDetail', { menu: item.menu })
            }
            style={({ pressed }) => [
              styles.row,
              shadows.card,
              pressed && styles.rowPressed,
            ]}>
            <Text style={styles.rowEmoji}>{menuEmoji(item.menu)}</Text>
            <View style={styles.rowBody}>
              <Text style={styles.rowMenu}>{item.menu}</Text>
              <Text style={styles.rowSummary} numberOfLines={1}>
                {item.summary}
              </Text>
              <Text style={styles.rowMeta}>
                ⏱ {item.prepMinutes}분
                {item.hasDetail ? ' · 상세 레시피' : ''}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  head: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.brown,
    marginTop: 8,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 6,
    textAlign: 'center',
  },
  search: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.brown,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  loader: { marginTop: 32 },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  rowPressed: { opacity: 0.9 },
  rowEmoji: { fontSize: 32, marginRight: 12 },
  rowBody: { flex: 1 },
  rowMenu: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.brown,
  },
  rowSummary: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    marginTop: 2,
  },
  rowMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.tileText,
    marginTop: 4,
  },
  chevron: {
    fontSize: 22,
    color: colors.taupe,
    marginLeft: 8,
  },
});
