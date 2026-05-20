import { useFocusEffect } from '@react-navigation/native';
import { ReactNode, useCallback, useRef } from 'react';
import { ScrollView, StatusBar, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  /** true면 탭/스택으로 이 화면에 올 때마다 맨 위 (레시피 목록처럼 뒤로가기 유지가 필요하면 false) */
  resetScrollOnFocus?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  contentStyle?: ViewStyle;
};

export default function ScreenContainer({
  children,
  scroll = true,
  resetScrollOnFocus = false,
  edges = ['top', 'left', 'right'],
  contentStyle,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      if (resetScrollOnFocus && scroll) {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      }
    }, [resetScrollOnFocus, scroll]),
  );

  const body = scroll ? (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[styles.scroll, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
});
