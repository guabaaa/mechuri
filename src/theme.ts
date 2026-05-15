import { useColorScheme } from 'react-native';

export type Theme = {
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
  const isDark = useColorScheme() === 'dark';
  if (isDark) {
    return {
      bg: '#0f0f10',
      card: '#1a1a1c',
      text: '#f4f4f5',
      sub: '#a1a1aa',
      accent: '#f59e0b',
      accentMuted: '#b45309',
      border: '#27272a',
      danger: '#f87171',
      kakao: '#fee500',
      naver: '#03c75a',
      apple: '#ffffff',
      googleBg: '#e8eaed',
      googleText: '#1f1f1f',
    };
  }
  return {
    bg: '#faf8f5',
    card: '#ffffff',
    text: '#18181b',
    sub: '#71717a',
    accent: '#ea580c',
    accentMuted: '#c2410c',
    border: '#e4e4e7',
    danger: '#dc2626',
    kakao: '#fee500',
    naver: '#03c75a',
    apple: '#000000',
    googleBg: '#ffffff',
    googleText: '#1f1f1f',
  };
}
