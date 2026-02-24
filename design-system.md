# 오늘 마음 · 花 — Design System v2

> **컨셉**: 일본 Zen 디자인의 차분한 여백 + 모트모트 플래너의 깔끔한 그리드 + 안경 쓴 고양이 캐릭터가 꽃말로 위로하는 따뜻한 감성

---

## 1. Design Tokens

### 1-1. Color Palette

#### Light Theme

| Token           | Hex       | 용도                     |
| --------------- | --------- | ------------------------ |
| `background`    | `#FAF9F6` | 크림 아이보리 · 앱 배경  |
| `card`          | `#FFFFFF` | 카드/시트 배경           |
| `surface`       | `#F3F0EB` | 입력 필드, 칩 배경       |
| `border`        | `#E8E4DE` | 카드 보더                |
| `borderLight`   | `#F0ECE6` | 미세 구분선              |
| `textPrimary`   | `#333333` | 차분한 다크 차콜 · 본문  |
| `textSecondary` | `#7A7268` | 부제/설명                |
| `textMuted`     | `#ADA598` | 힌트/비활성              |
| `textInverse`   | `#FFFFFF` | 다크 버튼 위 텍스트      |
| `primary`       | `#8B7EC8` | 차분한 바이올렛 · 포인트 |
| `primaryLight`  | `#B8ADE6` | 호버/포커스              |
| `secondary`     | `#A89BD4` | 보조 바이올렛            |
| `accent`        | `#E8A0BF` | 핑크 악센트              |
| `error`         | `#D4736E` | 오류                     |
| `warning`       | `#E0BE70` | 경고                     |
| `success`       | `#7BB88A` | 성공                     |

#### Dark Theme

| Token         | Hex       | 용도     |
| ------------- | --------- | -------- |
| `background`  | `#1A1818` | 딥 다크  |
| `card`        | `#262222` | 카드     |
| `textPrimary` | `#E8E3DB` | 본문     |
| `primary`     | `#A99BE0` | 바이올렛 |

### 1-2. Typography (Pretendard)

| Style       | Size | Weight         | Line Height | 용도                 |
| ----------- | ---- | -------------- | ----------- | -------------------- |
| `heading1`  | 28px | Bold (700)     | 36px        | 화면 타이틀          |
| `heading2`  | 22px | SemiBold (600) | 30px        | 섹션 제목            |
| `heading3`  | 18px | SemiBold (600) | 26px        | 카드 제목            |
| `body`      | 16px | Regular (400)  | 24px        | 본문                 |
| `bodySmall` | 14px | Regular (400)  | 22px        | 설명                 |
| `caption`   | 12px | Medium (500)   | 18px        | 라벨/힌트            |
| `overline`  | 11px | SemiBold (600) | 16px        | 섹션 라벨(uppercase) |

### 1-3. Spacing System (8px Grid)

| Token | Value | 용도             |
| ----- | ----- | ---------------- |
| `xs`  | 4px   | 아이콘 내부 패딩 |
| `sm`  | 8px   | 칩 패딩          |
| `md`  | 16px  | 카드 내부 패딩   |
| `lg`  | 24px  | 섹션 간 간격     |
| `xl`  | 32px  | 화면 상하 마진   |
| `xxl` | 48px  | 히어로 섹션 간격 |

### 1-4. Border Radius

| Token  | Value | 용도                   |
| ------ | ----- | ---------------------- |
| `sm`   | 8px   | 칩, 태그               |
| `md`   | 16px  | 카드, 입력 필드        |
| `lg`   | 24px  | 모달, 바텀시트         |
| `full` | 999px | 아바타, 원형 버튼(FAB) |

### 1-5. Shadows

```
elevation-sm: 0 2px 8px rgba(0,0,0,0.06)
elevation-md: 0 4px 16px rgba(0,0,0,0.08)
elevation-lg: 0 8px 24px rgba(0,0,0,0.12)
```

---

## 2. Atomic Components

### Atoms

- **Text**: Pretendard 전용, 7단계 스케일
- **Icon**: 감정 이모지(🌻🌸💠 등) + 탭바 이모지
- **Avatar**: 60×60, radius-full, 고양이 캐릭터
- **Chip**: radius-sm, surface 배경, caption 텍스트
- **Divider**: 1px borderLight

### Molecules

- **꽃말 카드 (FlowerCard)**: 140×180px, radius-md, 이모지 + 꽃 이름 + 꽃말
- **말풍선 (SpeechBubble)**: radius-lg, surface 배경, 고양이 대사
- **감정 칩 (EmotionChip)**: radius-sm, 이모지 + 감정 라벨

### Organisms

- **캐릭터 헤더 (CharacterHeader)**: 고양이 아바타 + 말풍선
- **꽃말 캐러셀 (FlowerCarousel)**: 가로 스크롤 꽃말 카드 리스트
- **일기 카드 리스트 (DiaryList)**: 세로 FlatList + 일기 카드
- **FAB (글쓰기)**: 56×56, radius-full, primary 색상

---

## 3. Screens

### Splash Screen

- 배경: `background` (#FAF9F6)
- 중앙: `splash-logo.png` (fade-in 800ms + scale 0.95→1.0)
- 하단: "오늘 마음" 타이틀 + "꽃으로 기록하는 나의 하루" 서브타이틀
- 프로그레스: primary 컬러 바
- 2초 후 자동 전환 (fade-out 300ms)

### Home Screen

- **상단 — 캐릭터 헤더**: guide-cat.png 60×60 + 말풍선 "JOA, 오늘의 마음은 어떤 꽃을 닮았나요?"
- **중단 — 꽃말 캐러셀**: 8종 감정 꽃 카드 가로 스크롤 (snap 포인트, 16px 간격)
- **하단 — 일기 리스트**: 최근 일기 카드 세로 스크롤
- **FAB**: 우하단 고정, primary 배경, ✏️ 아이콘

### Write Screen (기존 유지)

- 저장 시 꽃잎 Lottie 인터랙션

---

## 4. Motion & Interaction

### 스플래시 전환

- fade-in: 800ms ease-out
- 프로그레스: 1200ms ease-in-out
- fade-out: 300ms ease-in

### 카드 등장

- stagger: 각 카드 100ms 지연
- fade-in + translateY(20→0): 400ms ease-out

### 꽃잎 파티클

- 저장 완료 시 Lottie 꽃 애니메이션 오버레이
- 2초 재생 후 자동 dismiss

### FAB 인터랙션

- 터치 시 scale(1.0→0.92): 100ms
- 릴리스 시 scale(0.92→1.0): 150ms spring

---

## 5. Character: 안경 고양이 🐱

- **이미지**: `assets/images/guide-cat.png`
- **역할**: 사용자를 맞이하고, 감정 기록을 독려하는 따뜻한 안내자
- **크기**: 60×60 (홈 화면) / 120×120 (스플래시 화면)
- **배치**: 항상 왼쪽 정렬, 말풍선은 오른쪽에 부드러운 꼬리

---

## 6. Emotion–Flower Mapping

| 감정 | 꽃       | 이모지 | 꽃말                | 컬러    |
| ---- | -------- | ------ | ------------------- | ------- |
| 기쁨 | 해바라기 | 🌻     | 당신만을 바라봅니다 | #D4BC8A |
| 슬픔 | 수국     | 💠     | 진심을 담아         | #8BA4B5 |
| 화남 | 동백     | 🔴     | 기다림              | #C09090 |
| 평온 | 연꽃     | 🪷     | 순수한 마음         | #8AAF8C |
| 놀람 | 나팔꽃   | 🪻     | 덧없는 사랑         | #A098B8 |
| 사랑 | 벚꽃     | 🌸     | 아름다운 마음       | #C4A0A8 |
| 불안 | 라벤더   | 💜     | 침묵                | #C0A878 |
| 감사 | 매화     | 🌼     | 고결한 마음         | #8FB89A |
