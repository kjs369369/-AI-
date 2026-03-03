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
