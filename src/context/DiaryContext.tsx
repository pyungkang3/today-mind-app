/**
 * 오늘 마음 · 禅 — Diary Context
 * 일기 데이터 공유 상태 관리
 *
 * ✦ WriteScreen에서 저장 → HomeScreen에서 즉시 반영
 * ✦ 데모 데이터 포함 (초기 상태)
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { EmotionKey, WeatherKey } from '../theme';

// ─── 타입 정의 ───────────────────────────────────────────────────
export interface DiaryEntryData {
  id: string;
  diary: string;
  emotion: EmotionKey;
  weather?: WeatherKey;
  date: string;
  displayDate: string;
}

interface DiaryContextType {
  entries: DiaryEntryData[];
  addEntry: (entry: Omit<DiaryEntryData, 'id'>) => void;
}

// ─── 일본식 요일 ─────────────────────────────────────────────────
const JP_DAYS = ['日', '月', '火', '水', '木', '金', '土'];

const formatDate = (date: Date): string => {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const jpDay = JP_DAYS[date.getDay()];
  return `${m}월 ${d}일 ${jpDay}曜日`;
};

// ─── 데모 데이터 ─────────────────────────────────────────────────
const DEMO_ENTRIES: DiaryEntryData[] = [
  {
    id: 'demo-1',
    diary: '오늘은 작은 카페에서 차 한 잔의 여유를 누렸다. 창밖의 나무에 새가 앉아 있었다. 이런 소소한 순간이 행복이라는 걸 느꼈다.',
    emotion: 'joy',
    weather: 'sunny',
    date: new Date().toISOString(),
    displayDate: formatDate(new Date()),
  },
  {
    id: 'demo-2',
    diary: '비 온 뒤의 공기가 맑았다. 낙엽 위를 걸으며 마음이 차분해졌다.',
    emotion: 'calm',
    weather: 'rainy',
    date: new Date(Date.now() - 86400000).toISOString(),
    displayDate: formatDate(new Date(Date.now() - 86400000)),
  },
  {
    id: 'demo-3',
    diary: '오랜만에 친구에게 전화가 왔다. 멀리 있어도 마음은 가까울 수 있다.',
    emotion: 'grateful',
    weather: 'cloudy',
    date: new Date(Date.now() - 172800000).toISOString(),
    displayDate: formatDate(new Date(Date.now() - 172800000)),
  },
];

// ─── Context ─────────────────────────────────────────────────────
const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntryData[]>(DEMO_ENTRIES);

  const addEntry = useCallback((entry: Omit<DiaryEntryData, 'id'>) => {
    const newEntry: DiaryEntryData = {
      ...entry,
      id: `entry-${Date.now()}`,
    };
    setEntries((prev) => [newEntry, ...prev]); // 최신순
  }, []);

  return (
    <DiaryContext.Provider value={{ entries, addEntry }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = (): DiaryContextType => {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error('useDiary must be used within DiaryProvider');
  return ctx;
};
