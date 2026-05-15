import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SITUATIONS, Situation } from '../data/situations';
import { useAppTheme } from '../theme';

export default function SituationScreen() {
  const theme = useAppTheme();
  const isDark = useColorScheme() === 'dark';
  const [picked, setPicked] = useState<Situation | null>(null);

  const renderItem = useCallback(
    ({ item }: { item: Situation }) => (
      <Pressable
        onPress={() => setPicked(item)}
        style={({ pressed }) => [
          styles.tile,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
          pressed && { opacity: 0.9 },
        ]}>
        <Text style={[styles.tileTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.tileHint, { color: theme.sub }]}>{item.hint}</Text>
      </Pressable>
    ),
    [theme],
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.inner}>
        <Text style={[styles.head, { color: theme.text }]}>상황별 메뉴</Text>
        <Text style={[styles.sub, { color: theme.sub }]}>
          지금 상태를 고르면 그에 맞는 메뉴를 추천해요.
        </Text>

        {picked ? (
          <View
            style={[
              styles.result,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Text style={[styles.resultTitle, { color: theme.text }]}>
              {picked.title}
            </Text>
            <Text style={[styles.resultMsg, { color: theme.sub }]}>
              {picked.message}
            </Text>
            <Text style={[styles.rec, { color: theme.accent }]}>
              추천: {picked.menus.join(' / ')}
            </Text>
            <Pressable
              onPress={() => setPicked(null)}
              style={({ pressed }) => [
                styles.back,
                { borderColor: theme.accent },
                pressed && { opacity: 0.85 },
              ]}>
              <Text style={[styles.backLabel, { color: theme.accent }]}>
                목록으로
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={SITUATIONS}
            keyExtractor={(i) => i.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  head: { fontSize: 24, fontWeight: '800', marginBottom: 8, paddingHorizontal: 6 },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  list: { paddingBottom: 32 },
  row: { gap: 10, marginBottom: 10 },
  tile: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    minHeight: 88,
  },
  tileTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  tileHint: { fontSize: 12 },
  result: {
    marginHorizontal: 6,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  resultTitle: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
  resultMsg: { fontSize: 15, lineHeight: 22, marginBottom: 14 },
  rec: { fontSize: 16, fontWeight: '700', marginBottom: 18 },
  back: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  backLabel: { fontWeight: '700' },
});
