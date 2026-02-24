/**
 * 오늘 마음 · 禅 — DiaryCard (Organism)
 * 일기 카드 — 紙(kami)のような温もり
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme, EmotionKey } from '../theme';

export interface DiaryEntry {
  id: string;
  title: string;
  body: string;
  date: string;       // 예: "2월 24일 月曜日"
  emotion: EmotionKey;
}

interface DiaryCardProps {
  entry: DiaryEntry;
  onPress?: () => void;
}

export const DiaryCard: React.FC<DiaryCardProps> = ({ entry, onPress }) => {
  const theme = useTheme();
  const emotion = theme.emotions[entry.emotion];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        theme.shadows.level1,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.borderLight,
          borderRadius: theme.radius.xl,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {/* Header — 날짜 + 감정 아이콘 */}
      <View style={styles.header}>
        <Text style={[styles.date, { color: theme.colors.textMuted }]}>
          {entry.date}
        </Text>
        <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
      </View>

      {/* Title */}
      <Text
        style={[styles.title, { color: theme.colors.textPrimary }]}
        numberOfLines={1}
      >
        {entry.title}
      </Text>

      {/* Body preview */}
      <Text
        style={[styles.body, { color: theme.colors.textSecondary }]}
        numberOfLines={2}
      >
        {entry.body}
      </Text>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={[
          styles.emotionTag,
          { backgroundColor: theme.getEmotionBg(entry.emotion) },
        ]}>
          <Text style={[styles.emotionTagText, { color: emotion.fg }]}>
            {emotion.emoji} {emotion.name}
          </Text>
        </View>
        <Text style={[styles.readMore, { color: theme.colors.textMuted }]}>
          더 보기 →
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    gap: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    fontFamily: 'Pretendard',
  },
  emotionEmoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Pretendard',
  },
  body: {
    fontSize: 14,
    fontFamily: 'Pretendard',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emotionTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  emotionTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  readMore: {
    fontSize: 12,
    fontFamily: 'Pretendard',
  },
});
