/** 메추리 브랜드 컬러 (디자인 가이드) */
export const colors = {
  yellow: '#FFD84D',
  orange: '#FFB020',
  cream: '#FFF9EC',
  brown: '#3A2A1A',
  taupe: '#8A7A68',
  red: '#FF5A3D',
  purple: '#7C5CFF',
  white: '#FFFFFF',
  cardShadow: 'rgba(58, 42, 26, 0.12)',
  /** 타일 테두리·라벨 (진한 검정 대신 웜톤) */
  tileBorder: '#E5D4BC',
  tileText: '#7A6552',
  tileShadow: 'rgba(255, 176, 32, 0.22)',
} as const;

/** 홈 기능 타일 배경 */
export const homeTileTints = {
  menu: '#FFEDAA',
  mbti: '#FFF4D6',
  roulette: '#FFE4D4',
  ladder: '#D4EDDA',
  fortune: '#EDE4FF',
  delivery: '#FFD6E8',
  nearby: '#D6E8FF',
  recipe: '#FFF0E0',
  meal: '#FFE8CC',
} as const;

export const homeScreenPadding = 20;
export const homeTileGap = 12;
export const homeTileHeight = 118;

export type Theme = typeof colors & {
  bg: string;
  card: string;
  text: string;
  sub: string;
  accent: string;
  accentMuted: string;
  border: string;
  danger: string;
  kakao: string;
  naver: string;
  apple: string;
  googleBg: string;
  googleText: string;
};

export function useAppTheme(): Theme {
  return {
    ...colors,
    bg: colors.cream,
    card: colors.white,
    text: colors.brown,
    sub: colors.taupe,
    accent: colors.red,
    accentMuted: colors.orange,
    border: '#EDE4D4',
    danger: colors.red,
    kakao: '#FEE500',
    naver: '#03C75A',
    apple: '#000000',
    googleBg: '#FFFFFF',
    googleText: '#1F1F1F',
  };
}

export const shadows = {
  card: {
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tile: {
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
};
