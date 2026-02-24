/**
 * 오늘 마음 · 花 — Color System v2
 * 크림 아이보리 + 차분한 바이올렛 포인트
 */

// ─── Emotion Colors — 花言葉(하나코토바) ────────────────────────
export const emotionColors = {
  joy:       { emoji: '🌻', name: '해바라기',  flower: '向日葵', flowerWord: '당신만을 바라봅니다', fg: '#D4BC8A', lightBg: '#FAF5EB', darkBg: '#2E2820' },
  sad:       { emoji: '💠', name: '수국',      flower: '紫陽花', flowerWord: '진심을 담아',       fg: '#8BA4B5', lightBg: '#EFF3F6', darkBg: '#1E2428' },
  angry:     { emoji: '🔴', name: '동백',      flower: '赤椿',   flowerWord: '기다림',           fg: '#C09090', lightBg: '#F8F0F0', darkBg: '#2A2020' },
  calm:      { emoji: '🪷', name: '연꽃',      flower: '蓮',     flowerWord: '순수한 마음',      fg: '#8AAF8C', lightBg: '#EFF5EF', darkBg: '#1E2820' },
  surprised: { emoji: '🪻', name: '나팔꽃',    flower: '朝顔',   flowerWord: '덧없는 사랑',      fg: '#A098B8', lightBg: '#F3F1F7', darkBg: '#22202A' },
  loved:     { emoji: '🌸', name: '벚꽃',      flower: '桜',     flowerWord: '아름다운 마음',    fg: '#C4A0A8', lightBg: '#F8F2F4', darkBg: '#2A2024' },
  anxious:   { emoji: '💜', name: '라벤더',    flower: '薫衣草', flowerWord: '침묵',             fg: '#C0A878', lightBg: '#F7F3EB', darkBg: '#28261E' },
  grateful:  { emoji: '🌼', name: '매화',      flower: '梅',     flowerWord: '고결한 마음',      fg: '#8FB89A', lightBg: '#EFF6F1', darkBg: '#1E2820' },
} as const;

export type EmotionKey = keyof typeof emotionColors;

// ─── Weather Icons — 空模様(소라모요) ───────────────────────────
export const weatherIcons = {
  sunny:  { emoji: '☀️', name: '맑음',   jp: '晴れ' },
  cloudy: { emoji: '☁️', name: '흐림',   jp: '曇り' },
  rainy:  { emoji: '🌧️', name: '비',     jp: '雨' },
  snowy:  { emoji: '❄️', name: '눈',     jp: '雪' },
  windy:  { emoji: '🍃', name: '바람',   jp: '風' },
  foggy:  { emoji: '🌫️', name: '안개',   jp: '霧' },
} as const;

export type WeatherKey = keyof typeof weatherIcons;

// ─── Theme Colors ───────────────────────────────────────────────
export interface ThemeColors {
  background: string;
  card: string;
  surface: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  error: string;
  warning: string;
  success: string;
}

// ─── Light Theme — 크림 아이보리 + 바이올렛 ────────────────────
export const lightColors: ThemeColors = {
  background:    '#FAF9F6',
  card:          '#FFFFFF',
  surface:       '#F3F0EB',
  border:        '#E8E4DE',
  borderLight:   '#F0ECE6',
  textPrimary:   '#333333',
  textSecondary: '#7A7268',
  textMuted:     '#ADA598',
  textInverse:   '#FFFFFF',
  primary:       '#8B7EC8',
  primaryLight:  '#B8ADE6',
  secondary:     '#A89BD4',
  accent:        '#E8A0BF',
  error:         '#D4736E',
  warning:       '#E0BE70',
  success:       '#7BB88A',
};

// ─── Dark Theme — 바이올렛 다크 ─────────────────────────────────
export const darkColors: ThemeColors = {
  background:    '#1A1818',
  card:          '#262222',
  surface:       '#302C28',
  border:        '#3D3832',
  borderLight:   '#332F2A',
  textPrimary:   '#E8E3DB',
  textSecondary: '#9E968C',
  textMuted:     '#6B635A',
  textInverse:   '#1A1818',
  primary:       '#A99BE0',
  primaryLight:  '#8B7EC8',
  secondary:     '#9088C0',
  accent:        '#E8A0BF',
  error:         '#D49080',
  warning:       '#E0BE70',
  success:       '#7FB888',
};

// ─── 감정별 배경색 가져오기 ─────────────────────────────────────
export const getEmotionBg = (key: EmotionKey, isDark: boolean): string =>
  isDark ? emotionColors[key].darkBg : emotionColors[key].lightBg;
