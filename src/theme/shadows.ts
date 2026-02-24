/**
 * 오늘 마음 · 禅 — Elevation / Shadows
 * 影(카게)の深さ — 극도로 절제된 깊이감
 */
import { Platform, ViewStyle } from 'react-native';

export const shadows: Record<string, ViewStyle> = {
  none: {},

  level1: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }) as ViewStyle,

  level2: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 14,
    },
    android: { elevation: 6 },
    default: {},
  }) as ViewStyle,
};
