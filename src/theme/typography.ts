/**
 * 오늘 마음 · 禅 — Typography
 * Pretendard — 하이엔드 한글 산세리프
 *
 * ✦ 모든 UI 텍스트: Pretendard
 * ✦ 일기 본문: Pretendard (차분한 가독성)
 */
import { TextStyle } from 'react-native';

/** 앱 전역 폰트 패밀리 */
export const FONT_FAMILY = 'Pretendard';

export const typography = {
  display: {
    fontFamily: FONT_FAMILY,
    fontSize: 40,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 48,
  },
  heading1: {
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 36,
  },
  heading2: {
    fontFamily: FONT_FAMILY,
    fontSize: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 29,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: 'normal' as TextStyle['fontWeight'],
    lineHeight: 29,
  },
  body: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: 'normal' as TextStyle['fontWeight'],
    lineHeight: 26,
  },
  caption: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    fontWeight: 'normal' as TextStyle['fontWeight'],
    lineHeight: 18,
  },
  overline: {
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
} as const;
