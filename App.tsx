import React, { useState, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import { CAMERA_ANGLES, MAX_IMAGES, MAX_FILE_SIZE_MB } from './constants';
import { generatePrompt, generateImage } from './services/geminiService';
import type { GeneratedImage, CameraAngle } from './types';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import CameraView from './components/CameraView';
import ImageGrid from './components/ImageGrid';
import Lightbox from './components/Lightbox';
import LoadingBar from './components/LoadingBar';
import ApiKeyModal from './components/ApiKeyModal';
import type { ApiTier } from './components/ApiKeyModal';

const IMAGE_COUNT_OPTIONS = [1, 2, 4, 6, 8, 10];
const CONCURRENCY = 3;

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
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini_api_key'));
  const [apiTier, setApiTier] = useState<ApiTier>(() => (localStorage.getItem('gemini_api_tier') as ApiTier) || 'free');
  const [showApiModal, setShowApiModal] = useState(!apiKey);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imageCount, setImageCount] = useState<number>(4);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const completedRef = useRef(0);

  const handleApiKeySave = (key: string, tier: ApiTier) => {
    setApiKey(key);
    setApiTier(tier);
    setShowApiModal(false);
  };

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
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }

    setError(null);
    setIsLoading(true);
    setProgress(0);
    setGeneratedImages([]);
    completedRef.current = 0;

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

      const totalCount = selectedAngles.length;

      // 한 장을 생성하고 즉시 화면에 추가
      const generateOne = async (angle: CameraAngle): Promise<void> => {
        const prompt = await generatePrompt(apiKey, apiTier, angle.value);
        const generatedImgBase64 = await generateImage(apiKey, apiTier, base64Image, mimeType, prompt);
        const newImage: GeneratedImage = {
          id: crypto.randomUUID(),
          src: `data:image/png;base64,${generatedImgBase64}`,
          angleName: angle.name,
        };
        completedRef.current++;
        setGeneratedImages(prev => [...prev, newImage]);
        setProgress(Math.round((completedRef.current / totalCount) * 100));
      };

      // 동시성 제한 병렬 처리 (3개씩)
      const queue = [...selectedAngles];
      const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
        while (queue.length > 0) {
          const angle = queue.shift()!;
          await generateOne(angle);
        }
      });

      await Promise.all(workers);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes('API_KEY')) {
        setError('API 키가 유효하지 않습니다. 설정을 확인해주세요.');
      } else {
        setError('일부 이미지 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [sourceFile, imageCount, apiKey, apiTier]);

  const handleDownloadAll = useCallback(async () => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const folderName = `nanobanana_${timestamp}`;

    const zip = new JSZip();
    const folder = zip.folder(folderName)!;

    generatedImages.forEach((image, index) => {
      const base64Data = image.src.split(',')[1];
      const fileName = `${String(index + 1).padStart(2, '0')}_${image.angleName.replace(/\s/g, '_')}.png`;
      folder.file(fileName, base64Data, { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [generatedImages]);

  const hasImages = generatedImages.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center">
      {showApiModal && <ApiKeyModal onSave={handleApiKeySave} />}
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

      <main className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 px-4 pb-8">
        {/* 로딩 중에도 이미 생성된 이미지는 그리드로 표시 */}
        {isLoading && (
          <>
            <LoadingBar progress={progress} total={imageCount} />
            {hasImages && (
              <ImageGrid images={generatedImages} onImageClick={setLightboxIndex} />
            )}
          </>
        )}

        {!isLoading && (
          <>
            {!hasImages && (
              <div className="w-full max-w-md mx-auto space-y-4">
                {/* API Status Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white dark:bg-apple-card-dark shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-apple-gray dark:text-apple-gray-dark">
                      {apiKey
                        ? `${apiTier === 'paid' ? '유료' : '무료'} 플랜 · API 연결됨`
                        : 'API 키 미설정'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowApiModal(true)}
                    className="text-xs font-medium text-apple-blue dark:text-apple-blue-dark hover:opacity-70 transition"
                  >
                    {apiKey ? '변경' : '설정'}
                  </button>
                </div>

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

            {hasImages && (
              <div className="w-full flex flex-col items-center gap-8">
                <ImageGrid
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
