/**
 * 오늘 마음 · 禅 — AppHeader (Organism)
 * 앱 헤더 — 余白のある表題
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme';

interface AppHeaderProps {
  title?: string;
  onSearchPress?: () => void;
  onSettingsPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = '오늘 마음',
  onSearchPress,
  onSettingsPress,
}) => {
  const theme = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.colors.background,
        borderBottomColor: theme.colors.borderLight,
      },
    ]}>
      <Text style={[
        styles.title,
        { color: theme.colors.textPrimary },
      ]}>
        {title}
      </Text>

      <View style={styles.icons}>
        <Pressable
          onPress={onSearchPress}
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.iconText, { color: theme.colors.textSecondary }]}>
            🔍
          </Text>
        </Pressable>

        <Pressable
          onPress={onSettingsPress}
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.iconText, { color: theme.colors.textSecondary }]}>
            ⚙️
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Pretendard',
  },
  icons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  iconText: {
    fontSize: 20,
  },
});
