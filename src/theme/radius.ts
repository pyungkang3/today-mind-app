/**
 * 오늘 마음 · 花 — Border Radius (모트모트 감성 라운딩)
 */
export const radius = {
  sm:   8,
  md:   16,
  lg:   24,
  full: 999,
} as const;

export type RadiusKey = keyof typeof radius;
