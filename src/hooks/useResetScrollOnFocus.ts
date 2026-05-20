import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import type { RefObject } from 'react';
import type { ScrollView } from 'react-native';

/** 화면에 다시 들어올 때 스크롤을 맨 위로 (기능 화면·탭 루트용) */
export function useResetScrollOnFocus(
  ref: RefObject<ScrollView | null>,
  enabled = true,
) {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) {
        return;
      }
      ref.current?.scrollTo({ y: 0, animated: false });
    }, [enabled, ref]),
  );
}
