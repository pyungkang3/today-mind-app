/**
 * 오늘 마음 · 花 — Lottie Overlay
 * 고품질 꽃 모션 애니메이션 오버레이
 *
 * ✦ lottie-react-native + 표준 RN Animated API
 * ✦ 2.5초 fail-safe 타이머 내장
 * ✦ visible=true → 꽃 애니메이션 → onFinish 콜백
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── 확실히 작동하는 가벼운 Lottie 꽃/하트 애니메이션 ────────────
const FLOWER_LOTTIE_URI =
  'https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json';

const FAILSAFE_TIMEOUT_MS = 2500;

interface LottieOverlayProps {
  visible: boolean;
  onFinish?: () => void;
}

export const LottieOverlay: React.FC<LottieOverlayProps> = ({
  visible,
  onFinish,
}) => {
  const lottieRef = useRef<LottieView>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const hasFinished = useRef(false);
  const failsafeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── 안전한 finish 호출 (중복 방지) ────────────────────────────
  const safeFinish = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;

    // 타이머 정리
    if (failsafeTimer.current) {
      clearTimeout(failsafeTimer.current);
      failsafeTimer.current = null;
    }

    // 페이드아웃 후 콜백
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

      // 페이드인
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      // Lottie 재생
      setTimeout(() => {
        lottieRef.current?.play();
      }, 100);

      // 🛡️ 2.5초 강제 복귀 타이머 (fail-safe)
      failsafeTimer.current = setTimeout(() => {
        safeFinish();
      }, FAILSAFE_TIMEOUT_MS);
    } else {
      // visible 해제 시 깨끗하게 초기화
      hasFinished.current = false;
      opacity.setValue(0);
      lottieRef.current?.reset();
      if (failsafeTimer.current) {
        clearTimeout(failsafeTimer.current);
        failsafeTimer.current = null;
      }
    }

    return () => {
      if (failsafeTimer.current) {
        clearTimeout(failsafeTimer.current);
        failsafeTimer.current = null;
      }
    };
  }, [visible, opacity, safeFinish]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="none">
      <LottieView
        ref={lottieRef}
        source={{ uri: FLOWER_LOTTIE_URI }}
        style={styles.lottie}
        autoPlay={false}
        loop={false}
        speed={0.8}
        onAnimationFinish={() => safeFinish()}
        resizeMode="cover"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 249, 246, 0.88)',
  },
  lottie: {
    width: SCREEN_W * 0.8,
    height: SCREEN_H * 0.5,
  },
});
