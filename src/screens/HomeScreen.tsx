/**
 * 오늘 마음 · 花 — Home Screen
 * 고양이 캐릭터 헤더 + 꽃말 캐러셀 + 일기 리스트 + FAB
 */
import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme, emotionColors } from '../theme';
import { useDiary, DiaryEntryData } from '../context/DiaryContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FLOWER_CARD_WIDTH = 140;
const FLOWER_CARD_HEIGHT = 180;

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// ─── 감정 꽃 데이터 ─────────────────────────────────────────────
const flowerData = Object.entries(emotionColors).map(([key, val]) => ({
  key: key as keyof typeof emotionColors,
  ...val,
}));

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavProp>();
  const { entries } = useDiary();

  // ─── FAB 애니메이션 ─────────────────────────────────────────
  const fabScale = useRef(new Animated.Value(1)).current;
  const handleFabIn = () =>
    Animated.spring(fabScale, { toValue: 0.92, useNativeDriver: true }).start();
  const handleFabOut = () =>
    Animated.spring(fabScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  // ─── 헤더 등장 애니메이션 ─────────────────────────────────────
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const carouselFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(carouselFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ─── 꽃말 카드 렌더 ─────────────────────────────────────────
  const renderFlowerCard = useCallback(
    (item: (typeof flowerData)[0], index: number) => (
      <TouchableOpacity
        key={item.key}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Write')}
        style={[
          styles.flowerCard,
          {
            backgroundColor: theme.isDark ? item.darkBg : item.lightBg,
            borderColor: theme.colors.borderLight,
          },
        ]}
      >
        <Text style={styles.flowerEmoji}>{item.emoji}</Text>
        <Text style={[styles.flowerName, { color: theme.colors.textPrimary }]}>
          {item.name}
        </Text>
        <Text style={[styles.flowerWord, { color: theme.colors.textSecondary }]}>
          {item.flowerWord}
        </Text>
      </TouchableOpacity>
    ),
    [theme, navigation],
  );

  // ─── 일기 카드 렌더 ─────────────────────────────────────────
  const renderDiaryCard = useCallback(
    ({ item, index }: { item: DiaryEntryData; index: number }) => {
      const emotion = emotionColors[item.emotion as keyof typeof emotionColors];
      return (
        <Animated.View
          style={[
            styles.diaryCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.borderLight,
            },
          ]}
        >
          <View style={styles.diaryHeader}>
            <Text style={styles.diaryEmoji}>{emotion?.emoji || '🌿'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.diaryTitle, { color: theme.colors.textPrimary }]}>
                {item.displayDate}
              </Text>
            </View>
          </View>
          <Text
            style={[styles.diaryBody, { color: theme.colors.textSecondary }]}
            numberOfLines={3}
          >
            {item.diary}
          </Text>
        </Animated.View>
      );
    },
    [theme],
  );

  // ─── 리스트 헤더 ─────────────────────────────────────────────
  const ListHeaderComponent = useCallback(
    () => (
      <View style={styles.listHeader}>
        {/* ──── 캐릭터 헤더 ──── */}
        <Animated.View
          style={[
            styles.characterHeader,
            {
              opacity: headerFade,
              transform: [{ translateY: headerSlide }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/guide-cat.png')}
            style={styles.catAvatar}
            resizeMode="contain"
          />
          <View
            style={[
              styles.speechBubble,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight },
            ]}
          >
            <Text style={[styles.speechText, { color: theme.colors.textPrimary }]}>
              JOA, 오늘의 마음은{'\n'}어떤 꽃을 닮았나요? 🌸
            </Text>
            <View
              style={[
                styles.speechTail,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight },
              ]}
            />
          </View>
        </Animated.View>

        {/* ──── 꽃말 캐러셀 ──── */}
        <Animated.View style={{ opacity: carouselFade }}>
          <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>
            오늘의 꽃말
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToInterval={FLOWER_CARD_WIDTH + 12}
            decelerationRate="fast"
          >
            {flowerData.map((item, index) => renderFlowerCard(item, index))}
          </ScrollView>
        </Animated.View>

        {/* ──── 일기 섹션 라벨 ──── */}
        {entries.length > 0 && (
          <Text style={[styles.sectionLabel, { color: theme.colors.textMuted, marginTop: 8 }]}>
            나의 기록
          </Text>
        )}
      </View>
    ),
    [theme, headerFade, headerSlide, carouselFade, entries.length, renderFlowerCard],
  );

  // ─── 빈 상태 ─────────────────────────────────────────────────
  const EmptyDiaryState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>📝</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
          아직 기록이 없어요
        </Text>
        <Text style={[styles.emptyBody, { color: theme.colors.textMuted }]}>
          아래 버튼을 눌러{'\n'}오늘의 마음을 기록해 보세요
        </Text>
      </View>
    ),
    [theme],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderDiaryCard}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={EmptyDiaryState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ──── 글쓰기 FAB ──── */}
      <Pressable
        onPressIn={handleFabIn}
        onPressOut={handleFabOut}
        onPress={() => navigation.navigate('Write')}
      >
        <Animated.View
          style={[
            styles.fab,
            {
              backgroundColor: theme.colors.primary,
              transform: [{ scale: fabScale }],
              shadowColor: theme.colors.primary,
            },
          ]}
        >
          <Text style={styles.fabIcon}>✏️</Text>
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 100 },
  listHeader: { paddingHorizontal: 20, paddingTop: 16, gap: 20 },

  // ── 캐릭터 헤더 ──
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  catAvatar: {
    width: 60,
    height: 60,
    borderRadius: 999,
  },
  speechBubble: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'relative',
  },
  speechText: {
    fontSize: 16,
    fontFamily: 'Pretendard',
    fontWeight: '500',
    lineHeight: 24,
  },
  speechTail: {
    position: 'absolute',
    left: -8,
    top: 18,
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopWidth: 0,
    transform: [{ rotate: '45deg' }],
  },

  // ── 섹션 라벨 ──
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  // ── 꽃말 캐러셀 ──
  carouselContent: {
    paddingRight: 20,
    gap: 12,
  },
  flowerCard: {
    width: FLOWER_CARD_WIDTH,
    height: FLOWER_CARD_HEIGHT,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  flowerEmoji: {
    fontSize: 40,
  },
  flowerName: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Pretendard',
  },
  flowerWord: {
    fontSize: 12,
    fontFamily: 'Pretendard',
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── 일기 카드 ──
  diaryCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  diaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  diaryEmoji: {
    fontSize: 28,
  },
  diaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard',
  },
  diaryDate: {
    fontSize: 12,
    fontFamily: 'Pretendard',
    marginTop: 2,
  },
  diaryBody: {
    fontSize: 14,
    fontFamily: 'Pretendard',
    lineHeight: 22,
  },

  // ── 빈 상태 ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 17, fontWeight: '600', fontFamily: 'Pretendard' },
  emptyBody: { fontSize: 14, fontFamily: 'Pretendard', textAlign: 'center', lineHeight: 22 },

  // ── FAB ──
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: { fontSize: 24 },
});
