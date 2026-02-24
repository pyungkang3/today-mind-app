/**
 * 오늘 마음 · 花 — Splash Screen
 * JOA 로고 페이드인 + 바이올렛 프로그레스 바
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const theme = useTheme();

  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.95)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(12)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const containerFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1단계: JOA 로고 페이드인 + 스케일
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2단계: 타이틀 텍스트 슬라이드 업
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // 3단계: 서브타이틀 + 프로그레스
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(subtitleFade, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(progressWidth, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
        ]).start();
      }, 200);
    });

    // 2.2초 후 전체 페이드아웃 → Home 전환
    const timer = setTimeout(() => {
      Animated.timing(containerFade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.colors.background, opacity: containerFade }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.content}>
        {/* JOA 로고 이미지 */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoFade,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/splash-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* 앱 타이틀 */}
        <Animated.Text
          style={[
            styles.title,
            {
              color: theme.colors.textPrimary,
              opacity: titleFade,
              transform: [{ translateY: titleTranslate }],
            },
          ]}
        >
          오늘 마음
        </Animated.Text>

        {/* 서브타이틀 */}
        <Animated.Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.textMuted,
              opacity: subtitleFade,
            },
          ]}
        >
          꽃으로 기록하는 나의 하루
        </Animated.Text>

        {/* 프로그레스 바 */}
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.primary,
                width: progressWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  logoContainer: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Pretendard',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Pretendard',
    letterSpacing: 0.3,
    marginTop: -4,
  },
  progressTrack: {
    width: 100,
    height: 3,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 24,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});
