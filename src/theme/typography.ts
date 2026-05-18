import { Platform } from 'react-native';

/**
 * display: Jua만 번들에 포함 (~2MB 절감을 위해 본문은 시스템 폰트)
 * link-fonts.sh → Jua-Regular.ttf 만 복사
 */
export const fonts = {
  display: Platform.select({
    ios: 'Jua',
    android: 'Jua-Regular',
    default: 'Jua-Regular',
  })!,
  body: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  })!,
} as const;
