/**
 * 오늘 마음 · 花
 * 余白(여백)의 미학으로 마음을 기록하는 글쓰기 앱
 *
 * App Entry Point
 * ✦ Pretendard 폰트 로딩 + SplashScreen 유지
 * ✦ 웹: 480px 모바일 프레임 중앙 정렬
 */
import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme, View, Platform, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { lightColors, darkColors } from './src/theme';
import { SplashScreen } from './src/screens/SplashScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { DiaryProvider } from './src/context/DiaryContext';

// ─── 폰트 로딩 중 스플래시 유지 ─────────────────────────────────
ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

const isWeb = Platform.OS === 'web';

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
    return (
      <WebFrame>
        <SplashScreen onFinish={handleSplashFinish} />
      </WebFrame>
    );
  }

  // 메인 앱
  return (
    <WebFrame>
      <DiaryProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={isDark ? ZenDarkTheme : ZenLightTheme}>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </DiaryProvider>
    </WebFrame>
  );
}

// ═══════════════════════════════════════════════════════════════════
// WebFrame — 웹에서만 모바일 폰 프레임 적용, 네이티브에서는 패스스루
// ═══════════════════════════════════════════════════════════════════
function WebFrame({ children }: { children: React.ReactNode }) {
  if (!isWeb) {
    return <>{children}</>;
  }

  return (
    <View style={webStyles.outerBg}>
      <View style={webStyles.phoneFrame}>
        {children}
      </View>
    </View>
  );
}

const webStyles = StyleSheet.create({
  outerBg: {
    flex: 1,
    backgroundColor: '#E8E6F0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%' as any,
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 480,
    minHeight: '100%' as any,
    backgroundColor: '#FAF9F6',
    // 그림자 — 폰이 떠 있는 느낌
    shadowColor: '#8B7EC8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
});
