# Apple-Style UI/UX Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the NanoBanana Love AI Image Generator with Apple-style aesthetics including dark mode, image carousel with lightbox, component separation, and Tailwind CSS proper installation.

**Architecture:** Extract all inline components from App.tsx into separate files under `components/` and `hooks/`. Replace Tailwind CDN with npm-installed Tailwind v3 + PostCSS. Use CSS scroll-snap for carousel and Tailwind `class` strategy for dark mode toggling. No external UI libraries.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v3 (npm), CSS scroll-snap, localStorage for theme persistence.

---

### Task 1: Tailwind CSS CDN to npm installation

**Files:**
- Modify: `package.json`
- Modify: `index.html:7` (remove CDN script)
- Modify: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `index.css`

**Step 1: Install Tailwind CSS and dependencies**

Run:
```bash
cd /c/Users/kjs36/8-SHOT-AI--Nano-Banana-Love--AI-Image-Generator
npm install -D tailwindcss@3 postcss autoprefixer
```

Expected: packages added to devDependencies.

**Step 2: Create tailwind.config.ts**

```ts
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        apple: {
          blue: '#0071E3',
          'blue-dark': '#2997FF',
          gray: '#86868B',
          'gray-dark': '#A1A1A6',
          'bg': '#F5F5F7',
          'bg-dark': '#1D1D1F',
          'text': '#1D1D1F',
          'text-dark': '#F5F5F7',
          'card-dark': '#2D2D2D',
        },
      },
    },
  },
  plugins: [],
}
```

**Step 3: Create postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 4: Create index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-apple-bg text-apple-text font-sans antialiased transition-colors duration-300;
  }
  .dark body {
    @apply bg-black text-apple-text-dark;
  }
}
```

**Step 5: Update index.html - remove CDN, remove importmap, remove body classes**

Replace the full `index.html` with:

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NanoBanana Love - AI Image Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

**Step 6: Update index.tsx to import CSS**

Add `import './index.css';` as the first import line in `index.tsx`.

**Step 7: Verify build works**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors. If there are TypeScript errors, they will be addressed in subsequent tasks.

**Step 8: Commit**

```bash
git add package.json package-lock.json tailwind.config.ts postcss.config.js index.css index.html index.tsx
git commit -m "build: Tailwind CSS CDN에서 npm 설치 방식으로 전환

다크모드 class 전략, 애플 스타일 커스텀 컬러 토큰 추가"
```

---

### Task 2: useTheme hook + ThemeToggle component

**Files:**
- Create: `hooks/useTheme.ts`
- Create: `components/ThemeToggle.tsx`

**Step 1: Create hooks/useTheme.ts**

```ts
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return { theme, toggleTheme };
}
```

**Step 2: Create components/ThemeToggle.tsx**

```tsx
import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
    className="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
  >
    {theme === 'light' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-apple-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-apple-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )}
  </button>
);

export default ThemeToggle;
```

**Step 3: Commit**

```bash
git add hooks/useTheme.ts components/ThemeToggle.tsx
git commit -m "feat: 다크모드 useTheme 훅 및 ThemeToggle 컴포넌트 추가

localStorage 저장, 시스템 설정 자동 감지, 해/달 아이콘 토글"
```

---

### Task 3: Header + Footer components

**Files:**
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`

**Step 1: Create components/Header.tsx**

```tsx
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => (
  <header className="w-full max-w-3xl mx-auto pt-12 pb-8 px-4">
    <div className="flex items-center justify-between">
      <div />
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
    <div className="text-center mt-4">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-apple-text dark:text-apple-text-dark">
        NanoBanana Love
      </h1>
      <p className="text-lg text-apple-gray dark:text-apple-gray-dark mt-3">
        AI 모델로 새로운 샷 만들기
      </p>
      <p className="text-sm text-apple-gray dark:text-apple-gray-dark mt-2">
        사진 한 장을 AI로 분석해 다양한 구도와 표정의 새로운 이미지를 만들어 드립니다.
      </p>
    </div>
  </header>
);

export default Header;
```

**Step 2: Create components/Footer.tsx**

```tsx
import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full text-center text-apple-gray dark:text-apple-gray-dark text-xs mt-16 pb-8">
    <p>Powered by AICLAB & Google Gemini</p>
    <p className="mt-1">제작문의 : AICLAB 김진수소장</p>
  </footer>
);

export default Footer;
```

**Step 3: Commit**

```bash
git add components/Header.tsx components/Footer.tsx
git commit -m "feat: Header, Footer 컴포넌트 분리

애플 스타일 타이포그래피, 다크모드 지원, ThemeToggle 통합"
```

---

### Task 4: FileUpload component with preview thumbnail + segment control

**Files:**
- Create: `components/FileUpload.tsx`

**Step 1: Create components/FileUpload.tsx**

This component combines file upload and camera trigger in a segment control, and shows a thumbnail preview when a file is selected.

```tsx
import React, { useState, useMemo } from 'react';
import { MAX_FILE_SIZE_MB } from '../constants';

type InputMode = 'upload' | 'camera';

interface FileUploadProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  onOpenCamera: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ selectedFile, onFileChange, onOpenCamera }) => {
  const [mode, setMode] = useState<InputMode>('upload');

  const previewUrl = useMemo(() => {
    if (selectedFile) return URL.createObjectURL(selectedFile);
    return null;
  }, [selectedFile]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileChange(e.target.files[0]);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div className="w-full">
      {/* Segment Control */}
      <div className="flex rounded-lg bg-black/5 dark:bg-white/10 p-1 mb-4">
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            mode === 'upload'
              ? 'bg-white dark:bg-apple-card-dark shadow-sm text-apple-text dark:text-apple-text-dark'
              : 'text-apple-gray dark:text-apple-gray-dark'
          }`}
        >
          파일 업로드
        </button>
        <button
          onClick={() => { setMode('camera'); onOpenCamera(); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            mode === 'camera'
              ? 'bg-white dark:bg-apple-card-dark shadow-sm text-apple-text dark:text-apple-text-dark'
              : 'text-apple-gray dark:text-apple-gray-dark'
          }`}
        >
          카메라 촬영
        </button>
      </div>

      {/* Upload Zone */}
      {mode === 'upload' && (
        <>
          {previewUrl ? (
            <div className="relative w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
              <img src={previewUrl} alt="미리보기" className="w-full h-48 object-cover" />
              <button
                onClick={() => onFileChange(null)}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition"
                aria-label="이미지 제거"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                <p className="text-white text-sm font-medium truncate">{selectedFile?.name}</p>
              </div>
            </div>
          ) : (
            <label
              htmlFor="file_upload"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex flex-col justify-center items-center w-full h-44 border border-dashed border-black/20 dark:border-white/20 rounded-2xl cursor-pointer transition-colors hover:border-apple-blue dark:hover:border-apple-blue-dark hover:bg-apple-blue/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-apple-gray dark:text-apple-gray-dark mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5" />
              </svg>
              <p className="text-sm font-medium text-apple-text dark:text-apple-text-dark">이미지를 드래그하거나 클릭하세요</p>
              <p className="text-xs text-apple-gray dark:text-apple-gray-dark mt-1">JPG, PNG / 최대 {MAX_FILE_SIZE_MB}MB</p>
            </label>
          )}
          <input id="file_upload" type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleChange} />
        </>
      )}
    </div>
  );
};

export default FileUpload;
```

**Step 2: Commit**

```bash
git add components/FileUpload.tsx
git commit -m "feat: FileUpload 컴포넌트 - 세그먼트 컨트롤 + 썸네일 미리보기

파일 업로드/카메라 탭 전환, 드래그앤드롭, 선택 시 미리보기 표시"
```

---

### Task 5: CameraView component (Apple-styled)

**Files:**
- Create: `components/CameraView.tsx`

**Step 1: Create components/CameraView.tsx**

Migrate the existing camera modal logic from App.tsx, restyle to Apple aesthetics:

```tsx
import React, { useRef, useEffect } from 'react';

interface CameraViewProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
        onClose();
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvasRef.current.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-apple-card-dark rounded-2xl shadow-2xl relative w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 dark:border-white/10">
          <h3 className="text-lg font-semibold text-apple-text dark:text-apple-text-dark">카메라</h3>
          <button onClick={onClose} aria-label="닫기" className="text-apple-gray hover:text-apple-text dark:hover:text-apple-text-dark transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover bg-black" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex justify-center py-5">
          <button
            onClick={handleCapture}
            aria-label="사진 촬영"
            className="w-16 h-16 rounded-full border-4 border-apple-blue dark:border-apple-blue-dark flex items-center justify-center transition hover:scale-105"
          >
            <div className="w-12 h-12 bg-apple-blue dark:bg-apple-blue-dark rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
```

**Step 2: Commit**

```bash
git add components/CameraView.tsx
git commit -m "feat: CameraView 컴포넌트 애플 스타일로 재디자인

배경 블러, 깔끔한 헤더/닫기 버튼, 블루 액센트 촬영 버튼"
```

---

### Task 6: ImageCarousel component with scroll-snap

**Files:**
- Create: `components/ImageCarousel.tsx`

**Step 1: Create components/ImageCarousel.tsx**

```tsx
import React, { useRef, useState, useEffect } from 'react';
import type { GeneratedImage } from '../types';

interface ImageCarouselProps {
  images: GeneratedImage[];
  onImageClick: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onImageClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const child = scrollRef.current.children[index] as HTMLElement;
      if (child) {
        child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const childWidth = container.children[0]?.clientWidth || 1;
      const gap = 16;
      const index = Math.round(scrollLeft / (childWidth + gap));
      setActiveIndex(Math.min(index, images.length - 1));
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [images.length]);

  const handleDownload = (e: React.MouseEvent, image: GeneratedImage, index: number) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `nanobanana-${index + 1}-${image.angleName.replace(/\s/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      {/* Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        {activeIndex > 0 && (
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-apple-card-dark/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition hover:scale-110"
            aria-label="이전"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-apple-text dark:text-apple-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {/* Right Arrow */}
        {activeIndex < images.length - 1 && (
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-apple-card-dark/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition hover:scale-110"
            aria-label="다음"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-apple-text dark:text-apple-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="flex-none w-72 sm:w-80 snap-center cursor-pointer group"
              onClick={() => onImageClick(index)}
            >
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-apple-card-dark shadow-sm hover:shadow-lg transition-shadow">
                <img src={image.src} alt={image.angleName} className="w-full aspect-square object-cover" />
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-apple-text dark:text-apple-text-dark">{image.angleName}</span>
                  <button
                    onClick={(e) => handleDownload(e, image, index)}
                    className="text-apple-blue dark:text-apple-blue-dark hover:opacity-70 transition"
                    aria-label={`${image.angleName} 다운로드`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`rounded-full transition-all ${
              index === activeIndex
                ? 'w-6 h-2 bg-apple-blue dark:bg-apple-blue-dark'
                : 'w-2 h-2 bg-black/20 dark:bg-white/20'
            }`}
            aria-label={`이미지 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
```

**Step 2: Commit**

```bash
git add components/ImageCarousel.tsx
git commit -m "feat: ImageCarousel 컴포넌트 - CSS scroll-snap 캐러셀

좌우 화살표, 도트 인디케이터, 개별 다운로드, 클릭 시 라이트박스 열기"
```

---

### Task 7: Lightbox component

**Files:**
- Create: `components/Lightbox.tsx`

**Step 1: Create components/Lightbox.tsx**

```tsx
import React, { useEffect, useCallback } from 'react';
import type { GeneratedImage } from '../types';

interface LightboxProps {
  images: GeneratedImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onNavigate }) => {
  const image = images[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
  }, [onClose, onNavigate, currentIndex, images.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `nanobanana-${currentIndex + 1}-${image.angleName.replace(/\s/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center" onClick={onClose}>
      {/* Top Bar */}
      <div className="absolute top-0 w-full flex items-center justify-between px-6 py-4 z-10" onClick={e => e.stopPropagation()}>
        <span className="text-white/70 text-sm font-medium">
          {currentIndex + 1} / {images.length} — {image.angleName}
        </span>
        <div className="flex items-center gap-3">
          <button onClick={handleDownload} className="text-white/70 hover:text-white transition" aria-label="다운로드">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white transition" aria-label="닫기">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          aria-label="이전 이미지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          aria-label="다음 이미지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <img
        src={image.src}
        alt={image.angleName}
        className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};

export default Lightbox;
```

**Step 2: Commit**

```bash
git add components/Lightbox.tsx
git commit -m "feat: Lightbox 컴포넌트 - 풀스크린 이미지 뷰어

ESC/화살표 키보드 지원, 좌우 네비게이션, 다운로드 버튼"
```

---

### Task 8: LoadingBar component (NProgress-style)

**Files:**
- Create: `components/LoadingBar.tsx`

**Step 1: Create components/LoadingBar.tsx**

```tsx
import React from 'react';

interface LoadingBarProps {
  progress: number;
  total: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress, total }) => {
  const completed = Math.round((progress / 100) * total);

  return (
    <>
      {/* Top fixed thin bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-black/5 dark:bg-white/5">
        <div
          className="h-full bg-apple-blue dark:bg-apple-blue-dark transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Center message */}
      <div className="w-full max-w-sm mx-auto text-center py-16 px-4">
        <div className="w-12 h-12 mx-auto mb-6 rounded-full border-2 border-apple-blue/30 border-t-apple-blue dark:border-apple-blue-dark/30 dark:border-t-apple-blue-dark animate-spin" />
        <p className="text-xl font-semibold text-apple-text dark:text-apple-text-dark">
          이미지 생성 중
        </p>
        <p className="text-apple-gray dark:text-apple-gray-dark mt-2 text-sm">
          {completed} / {total} 완료
        </p>
      </div>
    </>
  );
};

export default LoadingBar;
```

**Step 2: Commit**

```bash
git add components/LoadingBar.tsx
git commit -m "feat: LoadingBar 컴포넌트 - 상단 프로그레스 바 + 스피너

NProgress 스타일 상단 바, 깔끔한 스피너, 진행 상태 표시"
```

---

### Task 9: Rewrite App.tsx - wire all components together

**Files:**
- Modify: `App.tsx` (full rewrite)

**Step 1: Rewrite App.tsx**

Replace the entire file. This is the orchestrator: all UI lives in components, App.tsx manages state and calls services.

```tsx
import React, { useState, useCallback } from 'react';
import { CAMERA_ANGLES, MAX_IMAGES, MIN_IMAGES, MAX_FILE_SIZE_MB } from './constants';
import { generatePrompt, generateImage } from './services/geminiService';
import type { GeneratedImage, CameraAngle } from './types';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import CameraView from './components/CameraView';
import ImageCarousel from './components/ImageCarousel';
import Lightbox from './components/Lightbox';
import LoadingBar from './components/LoadingBar';

const IMAGE_COUNT_OPTIONS = [1, 2, 4, 6, 8, 10];

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imageCount, setImageCount] = useState<number>(4);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('JPG 또는 PNG 파일만 업로드할 수 있습니다.');
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.`);
        return;
      }
    }
    setSourceFile(file);
  };

  const handleCapture = (file: File) => {
    handleFileChange(file);
    setIsCameraOpen(false);
  };

  const handleGenerate = useCallback(async () => {
    if (!sourceFile) {
      setError('이미지 파일을 먼저 업로드해주세요.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setProgress(0);
    setGeneratedImages([]);

    try {
      const base64Image = await fileToBase64(sourceFile);
      const mimeType = sourceFile.type;

      let selectedAngles: CameraAngle[];
      if (imageCount === MAX_IMAGES) {
        selectedAngles = CAMERA_ANGLES;
      } else {
        const shuffled = [...CAMERA_ANGLES].sort(() => 0.5 - Math.random());
        selectedAngles = shuffled.slice(0, imageCount);
      }

      const generationPromises = selectedAngles.map(async (angle) => {
        const prompt = await generatePrompt(angle.value);
        const generatedImgBase64 = await generateImage(base64Image, mimeType, prompt);
        return {
          id: crypto.randomUUID(),
          src: `data:image/png;base64,${generatedImgBase64}`,
          angleName: angle.name,
        };
      });

      let completedCount = 0;
      const totalCount = generationPromises.length;
      const wrappedPromises = generationPromises.map(p =>
        p.then(result => {
          completedCount++;
          setProgress(Math.round((completedCount / totalCount) * 100));
          return result;
        })
      );

      const results = await Promise.all(wrappedPromises);
      setGeneratedImages(results);
    } catch (err) {
      console.error(err);
      setError('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceFile, imageCount]);

  const handleDownloadAll = () => {
    generatedImages.forEach((image, index) => {
      const link = document.createElement('a');
      link.href = image.src;
      link.download = `nanobanana-${index + 1}-${image.angleName.replace(/\s/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {isCameraOpen && <CameraView onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
      {lightboxIndex !== null && (
        <Lightbox
          images={generatedImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-10 px-4 pb-8">
        {isLoading ? (
          <LoadingBar progress={progress} total={imageCount} />
        ) : (
          <>
            {generatedImages.length === 0 && (
              <div className="w-full max-w-md mx-auto">
                {/* Upload Card */}
                <div className="bg-white dark:bg-apple-card-dark rounded-2xl shadow-sm p-6 space-y-6">
                  <FileUpload
                    selectedFile={sourceFile}
                    onFileChange={handleFileChange}
                    onOpenCamera={() => setIsCameraOpen(true)}
                  />

                  {/* Image Count Segment Control */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-apple-text dark:text-apple-text-dark">생성 매수</span>
                      <span className="text-sm font-semibold text-apple-blue dark:text-apple-blue-dark">{imageCount}장</span>
                    </div>
                    <div className="flex rounded-lg bg-black/5 dark:bg-white/10 p-1">
                      {IMAGE_COUNT_OPTIONS.map(count => (
                        <button
                          key={count}
                          onClick={() => setImageCount(count)}
                          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                            imageCount === count
                              ? 'bg-white dark:bg-apple-bg-dark shadow-sm text-apple-blue dark:text-apple-blue-dark'
                              : 'text-apple-gray dark:text-apple-gray-dark'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={!sourceFile}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-apple-blue dark:bg-apple-blue-dark transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    이미지 생성하기
                  </button>
                </div>
              </div>
            )}

            {generatedImages.length > 0 && (
              <div className="w-full flex flex-col items-center gap-8">
                <ImageCarousel
                  images={generatedImages}
                  onImageClick={setLightboxIndex}
                />
                <div className="flex gap-3 w-full max-w-sm">
                  <button
                    onClick={handleDownloadAll}
                    className="flex-1 py-3 rounded-xl font-semibold text-white bg-emerald-500 transition hover:opacity-90 active:scale-[0.98]"
                  >
                    전체 다운로드
                  </button>
                  <button
                    onClick={() => { setGeneratedImages([]); setSourceFile(null); }}
                    className="flex-1 py-3 rounded-xl font-semibold text-apple-blue dark:text-apple-blue-dark border border-apple-blue dark:border-apple-blue-dark transition hover:bg-apple-blue/5 active:scale-[0.98]"
                  >
                    새로 만들기
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
```

**Step 2: Verify build**

Run:
```bash
npm run build
```

Expected: Build succeeds.

**Step 3: Commit**

```bash
git add App.tsx
git commit -m "refactor: App.tsx 전체 리디자인 - 애플 스타일 적용

컴포넌트 분리 통합, 다크모드, 캐러셀, 라이트박스, 세그먼트 컨트롤 적용"
```

---

### Task 10: Update index.css with scrollbar-hide utility + dark body

**Files:**
- Modify: `index.css`

**Step 1: Add scrollbar-hide utility and dark body style to index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-apple-bg text-apple-text font-sans antialiased transition-colors duration-300;
  }
  .dark body {
    @apply bg-black text-apple-text-dark;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

**Step 2: Commit**

```bash
git add index.css
git commit -m "style: scrollbar-hide 유틸리티 + 다크모드 body 스타일 추가"
```

---

### Task 11: Final verification and cleanup

**Step 1: Install dependencies**

Run:
```bash
cd /c/Users/kjs36/8-SHOT-AI--Nano-Banana-Love--AI-Image-Generator
npm install
```

**Step 2: Run build**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 3: Run dev server to visually verify**

Run:
```bash
npm run dev
```

Expected: Opens on `http://localhost:3000`. Verify:
- Light/dark mode toggle works
- File upload with thumbnail preview
- Segment control for image count
- Apple-style colors and typography
- (API-dependent) Image generation, carousel, and lightbox

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: 최종 정리 - 의존성 설치 및 빌드 검증 완료"
```
