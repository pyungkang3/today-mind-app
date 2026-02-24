/**
 * 오늘 마음 · 禅 — Write Screen
 * 筆(ふで) — 마음을 기록하는 글쓰기 화면
 *
 * ✦ Zen 여백 미학 · 모트모트 라운딩 · 차분한 색감
 * ✦ 저장 → Lottie 꽃 애니메이션 → 상태 저장 → 홈 복귀
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme, EmotionKey, emotionColors, WeatherKey, weatherIcons } from '../theme';
import { LottieOverlay } from '../components/LottieOverlay';
import { useDiary } from '../context/DiaryContext';

// ─── 일본식 요일 ─────────────────────────────────────────────────
const JP_DAYS = ['日', '月', '火', '水', '木', '金', '土'];

const formatDisplayDate = (): string => {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const jpDay = JP_DAYS[now.getDay()];
  return `${m}월 ${d}일 ${jpDay}曜日`;
};

// ─── 키 배열 ─────────────────────────────────────────────────────
const emotionKeys = Object.keys(emotionColors) as EmotionKey[];
const weatherKeys = Object.keys(weatherIcons) as WeatherKey[];

export const WriteScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { addEntry } = useDiary();

  // ─── State ─────────────────────────────────────────────────────
  const [diary, setDiary] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionKey | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<WeatherKey | null>(null);
  const [showLottie, setShowLottie] = useState(false);

  // ─── 진입 fade/slide ──────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // ─── 파생 값 ──────────────────────────────────────────────────
  const emotionData = selectedEmotion ? emotionColors[selectedEmotion] : null;
  const canSave = diary.trim().length > 0 || selectedEmotion !== null;

  // ─── 중복 저장 방지 ref ──────────────────────────────────────
  const isSaving = useRef(false);
  const failsafeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ═══ 실제 저장 + 화면 복귀 (중복 호출 안전) ═══════════════════
  const doSaveAndGoBack = useCallback(() => {
    if (isSaving.current) return; // 이미 저장 중이면 무시
    isSaving.current = true;

    // 타이머 정리
    if (failsafeTimer.current) {
      clearTimeout(failsafeTimer.current);
      failsafeTimer.current = null;
    }

    // 📝 Context에 일기 저장
    addEntry({
      diary: diary.trim() || '(감정만 기록)',
      emotion: selectedEmotion || 'calm',
      weather: selectedWeather || undefined,
      date: new Date().toISOString(),
      displayDate: formatDisplayDate(),
    });

    // 오버레이 해제 → 홈 복귀
    setShowLottie(false);
    navigation.goBack();
  }, [diary, selectedEmotion, selectedWeather, addEntry, navigation]);

  // ═══ 저장 핸들러 — Lottie 실행 + 2.5초 fail-safe ═══════════════
  const handleSave = useCallback(() => {
    if (!canSave) {
      Alert.alert('빈 마음', '한 줄이라도 적거나 꽃을 골라주세요 🌿');
      return;
    }
    isSaving.current = false; // 새 저장 시작
    // 🎬 Lottie 즉시 표시
    setShowLottie(true);

    // 🛡️ 2.5초 무조건 강제 복귀 (fail-safe)
    failsafeTimer.current = setTimeout(() => {
      doSaveAndGoBack();
    }, 2500);
  }, [canSave, doSaveAndGoBack]);

  // ═══ Lottie onFinish 콜백 → 저장 + 복귀 ═════════════════════
  const handleLottieFinish = useCallback(() => {
    doSaveAndGoBack();
  }, [doSaveAndGoBack]);

  // ─── 뒤로 가기 ────────────────────────────────────────────────
  const handleBack = () => {
    if (diary.trim()) {
      Alert.alert('돌아가기', '작성 중인 내용이 사라져요.\n정말 돌아갈까요?', [
        { text: '계속 쓰기', style: 'cancel' },
        { text: '돌아가기', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  // ═══ 렌더 ══════════════════════════════════════════════════════
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* ═══ Lottie 꽃 애니메이션 오버레이 ═══ */}
      <LottieOverlay visible={showLottie} onFinish={handleLottieFinish} />

      {/* ─── 헤더 ─────────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: theme.colors.borderLight }]}>
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
        >
          <Text style={[styles.backText, { color: theme.colors.textSecondary }]}>✕</Text>
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          마음 기록
        </Text>

        <Pressable
          onPress={handleSave}
          hitSlop={12}
          style={({ pressed }) => [
            styles.saveBtn,
            {
              backgroundColor: canSave ? theme.colors.primary : theme.colors.surface,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          <Text
            style={[
              styles.saveBtnText,
              { color: canSave ? theme.colors.textInverse : theme.colors.textMuted },
            ]}
          >
            저장
          </Text>
        </Pressable>
      </View>

      {/* ─── 본문 영역 ────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          >
            {/* 날짜 */}
            <View style={styles.dateRow}>
              <View style={[styles.dateBadge, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                  {formatDisplayDate()}
                </Text>
              </View>
            </View>

            {/* 감정 미리보기 */}
            {emotionData && (
              <View
                style={[
                  styles.emotionPreview,
                  {
                    backgroundColor: emotionData.lightBg,
                    borderColor: emotionData.fg + '30',
                  },
                ]}
              >
                <Text style={styles.previewEmoji}>{emotionData.emoji}</Text>
                <View style={styles.previewInfo}>
                  <Text style={[styles.previewName, { color: emotionData.fg }]}>
                    {emotionData.name} · {emotionData.flower}
                  </Text>
                  <Text style={[styles.previewState, { color: theme.colors.textMuted }]}>
                    {emotionData.flowerWord}
                  </Text>
                </View>
              </View>
            )}

            {/* 한 줄 일기 */}
            <View style={styles.inputSection}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>
                오늘의 한 줄 · 今日の一言
              </Text>
              <View
                style={[
                  styles.inputCard,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: emotionData ? emotionData.fg + '25' : theme.colors.borderLight,
                  },
                ]}
              >
                <TextInput
                  style={[styles.textInput, { color: theme.colors.textPrimary }]}
                  placeholder="오늘 하루, 한 줄로 남겨보세요…"
                  placeholderTextColor={theme.colors.textMuted}
                  value={diary}
                  onChangeText={setDiary}
                  multiline
                  textAlignVertical="top"
                  maxLength={300}
                  scrollEnabled={false}
                />
                <Text style={[styles.charCount, { color: theme.colors.textMuted }]}>
                  {diary.length}/300
                </Text>
              </View>
            </View>

            {/* 날씨 */}
            <View style={styles.inputSection}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>
                오늘의 날씨 · 空模様
              </Text>
              <View
                style={[
                  styles.chipRow,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.borderLight,
                  },
                ]}
              >
                {weatherKeys.map((key) => {
                  const w = weatherIcons[key];
                  const selected = selectedWeather === key;
                  return (
                    <Pressable
                      key={key}
                      onPress={() => setSelectedWeather(selected ? null : key)}
                      style={({ pressed }) => [
                        styles.chip,
                        {
                          backgroundColor: selected ? theme.colors.surface : 'transparent',
                          borderColor: selected ? theme.colors.primary : 'transparent',
                          borderWidth: 1.5,
                          borderRadius: 14,
                          transform: [{ scale: pressed ? 0.92 : 1 }],
                        },
                      ]}
                    >
                      <Text style={styles.chipEmoji}>{w.emoji}</Text>
                      <Text
                        style={[
                          styles.chipName,
                          { color: selected ? theme.colors.primary : theme.colors.textMuted },
                        ]}
                      >
                        {w.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* ═══ 하단 고정 — 감정 꽃 셀렉터 ═══ */}
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: theme.colors.card,
              borderTopColor: theme.colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.bottomLabel, { color: theme.colors.textMuted }]}>
            오늘의 감정 · 花言葉
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emotionScroll}
          >
            {emotionKeys.map((key) => {
              const e = emotionColors[key];
              const selected = selectedEmotion === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setSelectedEmotion(selected ? null : key)}
                  style={({ pressed }) => [
                    styles.emotionChip,
                    {
                      backgroundColor: selected ? e.lightBg : theme.colors.surface,
                      borderColor: selected ? e.fg : theme.colors.borderLight,
                      borderWidth: selected ? 2 : 1,
                      transform: [{ scale: pressed ? 0.88 : selected ? 1.06 : 1 }],
                    },
                  ]}
                >
                  <Text style={styles.emotionEmoji}>{e.emoji}</Text>
                  <Text
                    style={[
                      styles.emotionName,
                      { color: selected ? e.fg : theme.colors.textMuted },
                    ]}
                  >
                    {e.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backText: { fontSize: 20, fontWeight: '300' },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 999,
  },
  saveBtnText: { fontSize: 14, fontWeight: '700' },

  // Scroll
  scrollContent: { padding: 24, paddingBottom: 32, gap: 22 },

  // Date
  dateRow: { alignItems: 'center' },
  dateBadge: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  dateText: { fontSize: 13, fontWeight: '500', letterSpacing: 0.5 },

  // Emotion Preview
  emotionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  previewEmoji: { fontSize: 38 },
  previewInfo: { gap: 2 },
  previewName: { fontSize: 15, fontWeight: '700' },
  previewState: { fontSize: 12, fontStyle: 'italic' },

  // Input
  inputSection: { gap: 10 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  inputCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 150,
  },
  textInput: {
    fontSize: 17,
    fontFamily: 'Pretendard',
    lineHeight: 28,
    flex: 1,
    minHeight: 110,
  },
  charCount: { fontSize: 11, textAlign: 'right' as const, marginTop: 8 },

  // Weather chips
  chipRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
  },
  chip: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 7,
    paddingHorizontal: 11,
    gap: 3,
    minWidth: 52,
  },
  chipEmoji: { fontSize: 20, lineHeight: 26 },
  chipName: { fontSize: 9, fontWeight: '600' },

  // Bottom emotion bar
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 4 : 12,
    paddingHorizontal: 16,
  },
  bottomLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  emotionScroll: { gap: 8, paddingHorizontal: 4 },
  emotionChip: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 3,
    minWidth: 54,
  },
  emotionEmoji: { fontSize: 26, lineHeight: 32 },
  emotionName: { fontSize: 9, fontWeight: '600' },
});
