/**
 * 오늘 마음 · 禅 — Theme Hook
 * 다크모드 자동 감지 + 감정 색상 유틸
 */
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors, emotionColors, EmotionKey, getEmotionBg } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
  emotions: typeof emotionColors;
  getEmotionBg: (key: EmotionKey) => string;
}

export const useTheme = (): Theme => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    spacing,
    radius,
    typography,
    shadows,
    emotions: emotionColors,
    getEmotionBg: (key: EmotionKey) => getEmotionBg(key, isDark),
  };
};
