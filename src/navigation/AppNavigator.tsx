/**
 * 오늘 마음 · 禅 — Navigation
 * Stack (Splash → MainTabs) + Bottom Tabs
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { WriteScreen } from '../screens/WriteScreen';

// ─── 플레이스홀더 화면들 (추후 구현) ────────────────────────────
const PlaceholderScreen: React.FC<{ title: string; emoji: string }> = ({ title, emoji }) => {
  const theme = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.placeholderEmoji}>{emoji}</Text>
      <Text style={[styles.placeholderText, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.placeholderSub, { color: theme.colors.textMuted }]}>
        준비 중이에요
      </Text>
    </View>
  );
};

const CalendarScreen = () => <PlaceholderScreen title="캘린더" emoji="📅" />;
const StatsScreen = () => <PlaceholderScreen title="통계" emoji="📊" />;
const ProfileScreen = () => <PlaceholderScreen title="내 정보" emoji="👤" />;

// ─── Bottom Tab Navigator ───────────────────────────────────────
const Tab = createBottomTabNavigator();

const tabConfig = [
  { name: 'Home', component: HomeScreen, icon: '🏠', label: '홈' },
  { name: 'Calendar', component: CalendarScreen, icon: '📅', label: '캘린더' },
  { name: 'Stats', component: StatsScreen, icon: '📊', label: '통계' },
  { name: 'Profile', component: ProfileScreen, icon: '👤', label: '내 정보' },
];

const MainTabs: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.borderLight,
          borderTopWidth: 1,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          fontFamily: 'Pretendard',
          marginTop: 4,
        },
      }}
    >
      {tabConfig.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
                {tab.icon}
              </Text>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

// ─── Root Stack Navigator ───────────────────────────────────────
export type RootStackParamList = {
  MainTabs: undefined;
  Write: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Write"
        component={WriteScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  placeholderText: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Pretendard',
  },
  placeholderSub: {
    fontSize: 14,
    fontFamily: 'Pretendard',
  },
});
