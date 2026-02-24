/**
 * 오늘 마음 · 禅 — EmotionSelector (Organism)
 * 감정 선택바 — 自然の色で感情を選ぶ
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme, EmotionKey, emotionColors } from '../theme';
import { EmotionIcon } from './EmotionIcon';

interface EmotionSelectorProps {
  selectedEmotion?: EmotionKey;
  onSelect?: (key: EmotionKey) => void;
}

const emotionKeys = Object.keys(emotionColors) as EmotionKey[];

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedEmotion,
  onSelect,
}) => {
  const theme = useTheme();
  const [selected, setSelected] = useState<EmotionKey | undefined>(selectedEmotion);

  const handleSelect = (key: EmotionKey) => {
    setSelected(key);
    onSelect?.(key);
  };

  // 이번 주 가장 많이 느낀 감정 (데모용)
  const topEmotion = selected || 'joy';
  const topEmotionData = theme.emotions[topEmotion];

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
      },
    ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {emotionKeys.map((key) => (
          <EmotionIcon
            key={key}
            emotionKey={key}
            size={44}
            selected={selected === key}
            onPress={() => handleSelect(key)}
          />
        ))}
      </ScrollView>
      <Text style={[
        styles.summary,
        { color: theme.colors.textSecondary },
      ]}>
        이번 주 가장 많이 느낀 감정: {topEmotionData.emoji} {topEmotionData.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 4,
  },
  summary: {
    fontSize: 12,
    fontFamily: 'Pretendard',
  },
});
