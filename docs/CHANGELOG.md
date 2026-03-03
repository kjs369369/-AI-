# NanoBanana Love - 변경 이력

## 2026-03-03: 애플 스타일 UI/UX 전체 리디자인

### 개요
기존 보라-핑크 그라디언트 UI에서 Apple 스타일 미니멀 디자인으로 전면 리디자인.
다크모드, 이미지 그리드, 라이트박스, API 키 관리 등 주요 기능 추가.

### 주요 변경사항

#### 1. 디자인 시스템 전환
- Tailwind CSS CDN → npm 설치 방식으로 전환
- 애플 스타일 컬러 시스템 적용 (라이트/다크 모드)
- 폰트: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto`
- 카드 UI: rounded-2xl, 미묘한 그림자, hover 효과

#### 2. 다크모드
- `prefers-color-scheme` 시스템 설정 자동 감지
- 수동 토글 (해/달 아이콘)
- localStorage에 선택값 저장

#### 3. 컴포넌트 분리
기존 App.tsx 단일 파일(419줄)에서 8개 컴포넌트 + 1개 훅으로 분리:

| 컴포넌트 | 설명 |
|----------|------|
| `components/Header.tsx` | 로고, 서브텍스트, 다크모드 토글 |
| `components/Footer.tsx` | AICLAB 크레딧 |
| `components/ThemeToggle.tsx` | 해/달 아이콘 다크모드 토글 버튼 |
| `components/FileUpload.tsx` | 세그먼트 컨트롤 (업로드/카메라) + 썸네일 미리보기 |
| `components/CameraView.tsx` | 애플 스타일 카메라 모달 |
| `components/ImageGrid.tsx` | 반응형 그리드 (2~5열) + 개별 다운로드 |
| `components/Lightbox.tsx` | 풀스크린 이미지 뷰어 (키보드 내비게이션) |
| `components/LoadingBar.tsx` | NProgress 스타일 상단 프로그레스 바 |
| `components/ApiKeyModal.tsx` | API 키 입력 + 유료/무료 플랜 선택 |
| `hooks/useTheme.ts` | 다크/라이트 모드 상태 관리 훅 |

#### 4. API 키 관리
- 브라우저 실행 시 API 키 입력 모달 자동 표시
- Google AI Studio 키 발급 링크 버튼
- 유료/무료 플랜 선택 기능:
  - **무료 플랜**: `gemini-2.0-flash` 모델 (이미지 품질 보통)
  - **유료 플랜**: `gemini-2.5-flash-image` 모델 (고품질, ~$0.04/장)
- API 키는 localStorage에만 저장 (외부 전송 없음)
- 메인 화면에 API 상태 바 표시 (연결 상태 + 플랜 + 변경 버튼)

#### 5. 이미지 생성 개선
- 동시성 제한 병렬 처리 (3장씩 동시 생성)
- 완성되는 대로 그리드에 즉시 표시 (fadeIn 애니메이션)
- 로딩 중에도 완성된 이미지 바로 확인 가능

#### 6. 이미지 결과 표시
- 반응형 그리드 레이아웃 (2~5열, 화면 크기에 따라)
- 이미지 클릭 시 풀스크린 라이트박스
  - ESC / 화살표 키보드 지원
  - 좌/우 네비게이션
  - 다운로드 버튼
- 각 이미지에 개별 다운로드 버튼

#### 7. ZIP 다운로드
- "전체 다운로드" 클릭 시 ZIP 파일로 묶어서 다운로드
- 파일명 형식: `nanobanana_YYYYMMDD_HHMMSS.zip`
- ZIP 내부 구조:
  ```
  nanobanana_20260303_143022/
  ├── 01_클로즈업.png
  ├── 02_미디엄_샷.png
  ├── 03_하이_앵글.png
  └── ...
  ```
- JSZip 라이브러리 사용

#### 8. 기타
- 매수 선택: range 슬라이더 → 세그먼트 컨트롤 (1, 2, 4, 6, 8, 10)
- 파일 업로드 시 썸네일 미리보기 표시
- 파일 업로드/카메라 촬영을 세그먼트 컨트롤로 전환
- 에러 메시지 개선 (API 키 오류 구분)

### 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite 6 |
| 스타일링 | Tailwind CSS 3 (npm) |
| AI API | Google Gemini (`@google/genai`) |
| ZIP 생성 | JSZip |
| 다크모드 | Tailwind `class` 전략 |
| 캐러셀 | CSS scroll-snap (→ 그리드로 변경) |

### 파일 구조

```
├── components/
│   ├── ApiKeyModal.tsx
│   ├── CameraView.tsx
│   ├── FileUpload.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ImageCarousel.tsx  (미사용, 그리드로 대체)
│   ├── ImageGrid.tsx
│   ├── Lightbox.tsx
│   ├── LoadingBar.tsx
│   └── ThemeToggle.tsx
├── hooks/
│   └── useTheme.ts
├── services/
│   └── geminiService.ts
├── docs/
│   ├── CHANGELOG.md
│   └── plans/
│       ├── 2026-03-03-ui-ux-redesign-design.md
│       └── 2026-03-03-ui-ux-redesign.md
├── App.tsx
├── index.tsx
├── index.css
├── index.html
├── constants.ts
├── types.ts
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
└── package.json
```
