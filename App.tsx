/**
 * 오늘 마음 · 禅
 * 余白(여백)의 미학으로 마음을 기록하는 글쓰기 앱
 *
 * App Entry Point
 * ✦ Pretendard 폰트 로딩 + SplashScreen 유지
 */
import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { lightColors, darkColors } from './src/theme';
import { SplashScreen } from './src/screens/SplashScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { DiaryProvider } from './src/context/DiaryContext';

// ─── 폰트 로딩 중 스플래시 유지 ─────────────────────────────────
ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

// ─── 커스텀 네비게이션 테마 ─────────────────────────────────────
const ZenLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.card,
    text: lightColors.textPrimary,
    border: lightColors.border,
    notification: lightColors.accent,
  },
};

const ZenDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkColors.primary,
    background: darkColors.background,
    card: darkColors.card,
    text: darkColors.textPrimary,
    border: darkColors.border,
    notification: darkColors.accent,
  },
};

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // ─── 폰트 로딩 ────────────────────────────────────────────────
  const [fontsLoaded] = useFonts({
    Pretendard: require('./assets/pretendard.ttf'),
  });

  // ─── 커스텀 스플래시 상태 ─────────────────────────────────────
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  // ─── 폰트 로딩 완료 시 네이티브 스플래시 숨기기 ────────────────
  useEffect(() => {
    if (fontsLoaded) {
      ExpoSplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  // 폰트 아직 로딩 중 — 빈 화면 (네이티브 스플래시가 가려줌)
  if (!fontsLoaded) {
    return null;
  }

  // 커스텀 스플래시 표시 중
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // 메인 앱
  return (
    <DiaryProvider>
      <SafeAreaProvider>
        <NavigationContainer theme={isDark ? ZenDarkTheme : ZenLightTheme}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </DiaryProvider>
  );
}
