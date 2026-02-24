/**
 * 오늘 마음 · 禅 — EmotionIcon (Atom)
 * 자연 모티프 감정 아이콘
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme, EmotionKey } from '../theme';

interface EmotionIconProps {
  emotionKey: EmotionKey;
  size?: number;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export const EmotionIcon: React.FC<EmotionIconProps> = ({
  emotionKey,
  size = 48,
  selected = false,
  disabled = false,
  onPress,
}) => {
  const theme = useTheme();
  const emotion = theme.emotions[emotionKey];
  const bg = theme.getEmotionBg(emotionKey);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: theme.radius.lg,
          backgroundColor: selected ? bg : theme.colors.card,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? emotion.fg : theme.colors.borderLight,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
          transform: [{ scale: pressed && !disabled ? 0.92 : 1 }],
        },
      ]}
    >
      <Text style={[styles.emoji, { fontSize: size * 0.45 }]}>
        {emotion.emoji}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
});
