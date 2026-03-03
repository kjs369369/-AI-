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
