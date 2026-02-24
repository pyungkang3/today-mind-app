/**
 * 오늘 마음 · 花 — Lottie Overlay
 * 꽃 모션 애니메이션 오버레이
 *
 * ✦ 표준 RN Animated API (웹/네이티브 모두 호환)
 * ✦ 2.5초 fail-safe 타이머 내장
 * ✦ visible=true → 꽃 이모지 파티클 애니메이션 → onFinish 콜백
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, Animated, Easing, Text, View } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const FAILSAFE_TIMEOUT_MS = 2500;
const ANIMATION_DURATION = 2000;

// 꽃잎 이모지 파티클들
const PETALS = ['🌸', '🌺', '💐', '🌷', '🌼', '✿', '❀', '🪻'];

interface LottieOverlayProps {
  visible: boolean;
  onFinish?: () => void;
}

export const LottieOverlay: React.FC<LottieOverlayProps> = ({
  visible,
  onFinish,
}) => {
  const hasFinished = useRef(false);
  const failsafeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 파티클 애니메이션 값들
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const petalAnims = useRef(
    PETALS.map(() => ({
      translateY: new Animated.Value(-60),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  // ─── 안전한 finish 호출 (중복 방지) ────────────────────────────
  const safeFinish = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;

    if (failsafeTimer.current) {
      clearTimeout(failsafeTimer.current);
      failsafeTimer.current = null;
    }
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }

    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      onFinish?.();
    });
  }, [onFinish, opacity]);

  useEffect(() => {
    if (visible) {
      hasFinished.current = false;

      // 페이드인 + 스케일
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // 꽃잎 파티클 애니메이션
      petalAnims.forEach((anim, i) => {
        const delay = i * 120;
        const targetX = (Math.random() - 0.5) * SCREEN_W * 0.6;
        const targetY = Math.random() * SCREEN_H * 0.4 + 50;

        anim.translateY.setValue(-60);
        anim.translateX.setValue(0);
        anim.opacity.setValue(0);
        anim.rotate.setValue(0);

        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: targetY,
              duration: 1500,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateX, {
              toValue: targetX,
              duration: 1500,
              easing: Easing.inOut(Easing.sine),
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: (Math.random() - 0.5) * 4,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });

      // 애니메이션 완료 타이머
      animationTimer.current = setTimeout(() => {
        safeFinish();
      }, ANIMATION_DURATION);

      // 🛡️ 2.5초 강제 복귀 (fail-safe)
      failsafeTimer.current = setTimeout(() => {
        safeFinish();
      }, FAILSAFE_TIMEOUT_MS);
    } else {
      hasFinished.current = false;
      opacity.setValue(0);
      scale.setValue(0.5);
      petalAnims.forEach((anim) => {
        anim.translateY.setValue(-60);
        anim.translateX.setValue(0);
        anim.opacity.setValue(0);
        anim.rotate.setValue(0);
      });
      if (failsafeTimer.current) {
        clearTimeout(failsafeTimer.current);
        failsafeTimer.current = null;
      }
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
        animationTimer.current = null;
      }
    }

    return () => {
      if (failsafeTimer.current) {
        clearTimeout(failsafeTimer.current);
        failsafeTimer.current = null;
      }
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
        animationTimer.current = null;
      }
    };
  }, [visible, opacity, scale, safeFinish, petalAnims]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="none">
      {/* 중앙 체크마크 */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={styles.checkEmoji}>✨</Text>
        <Text style={styles.savedText}>저장되었어요</Text>
      </Animated.View>

      {/* 꽃잎 파티클들 */}
      {petalAnims.map((anim, i) => {
        const spin = anim.rotate.interpolate({
          inputRange: [-4, 4],
          outputRange: ['-720deg', '720deg'],
        });
        return (
          <Animated.Text
            key={i}
            style={[
              styles.petal,
              {
                opacity: anim.opacity,
                transform: [
                  { translateY: anim.translateY },
                  { translateX: anim.translateX },
                  { rotate: spin },
                ],
              },
            ]}
          >
            {PETALS[i]}
          </Animated.Text>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 249, 246, 0.92)',
  },
  checkEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  savedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B7EC8',
    textAlign: 'center',
  },
  petal: {
    position: 'absolute',
    fontSize: 28,
    top: '40%',
    left: '50%',
  },
});
