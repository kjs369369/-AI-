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
