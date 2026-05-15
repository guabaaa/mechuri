import { Platform } from 'react-native';

/**
 * 커스텀 폰트 (src/assets/fonts → link-fonts.sh로 iOS/Android에 복사)
 * - Jua: 제목·로고
 * - Gowun Dodum: 본문·설명
 *
 * iOS/Android에서 fontFamily 이름이 다릅니다. 적용 후 `yarn ios`로 재빌드하세요.
 */
export const fonts = {
  display: Platform.select({
    ios: 'Jua',
    android: 'Jua-Regular',
    default: 'Jua-Regular',
  })!,
  body: Platform.select({
    ios: 'GowunDodum',
    android: 'GowunDodum-Regular',
    default: 'GowunDodum-Regular',
  })!,
} as const;
