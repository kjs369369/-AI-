# UI/UX 전체 리디자인 - 애플 스타일

## 개요

8-SHOT-AI Nano Banana Love AI Image Generator의 전체 UI/UX를 애플 스타일로 리디자인한다.
현재 단일 파일(App.tsx)에 모든 컴포넌트가 포함된 구조를 컴포넌트별로 분리하고,
다크모드, 캐러셀, 라이트박스 등을 외부 라이브러리 없이 순수 Tailwind CSS + CSS scroll-snap으로 구현한다.

## 기술 스택

- React 19 + TypeScript + Vite (유지)
- Tailwind CSS: CDN → npm 설치 방식으로 전환
- 캐러셀: CSS scroll-snap
- 다크모드: Tailwind `class` 전략
- 외부 UI 라이브러리: 없음

## 디자인 시스템

### 컬러

| 토큰 | 라이트 | 다크 |
|------|--------|------|
| bg-primary | #FFFFFF | #000000 |
| bg-secondary | #F5F5F7 | #1D1D1F |
| text-primary | #1D1D1F | #F5F5F7 |
| text-secondary | #86868B | #A1A1A6 |
| accent | #0071E3 | #2997FF |
| card | #FFFFFF | #2D2D2D |

### 타이포그래피

- 폰트: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- 타이틀: text-5xl font-bold tracking-tight
- 서브텍스트: text-lg text-secondary
- 카드: rounded-2xl, shadow-sm, hover:shadow-md transition

### 다크모드

- `prefers-color-scheme` 자동 감지 + 수동 토글
- 헤더 우측 해/달 아이콘 버튼
- localStorage에 선택값 저장

## 컴포넌트 설계

### Header.tsx
- 로고 텍스트 "NanoBanana Love" (이모지 제거, 깔끔한 텍스트)
- 서브텍스트: "AI 모델로 새로운 샷 만들기"
- 우측: ThemeToggle 버튼

### ThemeToggle.tsx
- useTheme 훅 사용
- 해/달 아이콘 전환 애니메이션

### FileUpload.tsx
- 탭/세그먼트 컨트롤: "파일 업로드" | "카메라 촬영"
- 업로드 시 미리보기 썸네일 표시
- 드래그앤드롭 존 (실선 테두리 + 아이콘)

### CameraView.tsx
- 기존 카메라 모달 유지, 스타일만 애플 스타일로 변경

### ImageCarousel.tsx
- CSS scroll-snap 기반 가로 스크롤
- 좌/우 화살표 버튼
- 하단 도트 인디케이터
- 이미지 클릭 시 Lightbox 열기
- 각 이미지 하단 개별 다운로드 버튼

### Lightbox.tsx
- 풀스크린 오버레이 (배경 블러)
- 좌/우 화살표로 이미지 넘기기
- ESC 또는 배경 클릭으로 닫기
- 다운로드 버튼

### LoadingBar.tsx
- 상단 고정 얇은 프로그레스 바 (NProgress 스타일)
- 생성된 이미지가 하나씩 페이드인으로 나타남

### Footer.tsx
- "Powered by AICLAB & Google Gemini" 유지

### hooks/useTheme.ts
- 다크/라이트 모드 상태 관리
- localStorage 저장/복원
- 시스템 설정 감지

## 파일 구조

```
├── components/
│   ├── Header.tsx
│   ├── ThemeToggle.tsx
│   ├── FileUpload.tsx
│   ├── CameraView.tsx
│   ├── ImageCarousel.tsx
│   ├── Lightbox.tsx
│   ├── LoadingBar.tsx
│   └── Footer.tsx
├── hooks/
│   └── useTheme.ts
├── App.tsx
├── index.tsx
├── index.css
├── constants.ts
├── types.ts
├── services/
│   └── geminiService.ts
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 매수 선택 UI

- 세그먼트 컨트롤 스타일 (1, 2, 4, 6, 8, 10)
- 선택된 값에 accent 색상 배경 + 슬라이딩 인디케이터

## 결과 액션 버튼

- "전체 다운로드" (초록 계열)
- "새로 만들기" (accent 블루)
- 둥근 pill 형태 버튼, hover 시 살짝 scale-up
