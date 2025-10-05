import React, { useState, useCallback } from 'react';
import { CAMERA_ANGLES, MAX_IMAGES, MIN_IMAGES, MAX_FILE_SIZE_MB } from './constants';
import { generatePrompt, generateImage } from './services/geminiService';
import type { GeneratedImage, CameraAngle } from './types';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};


// --- Helper Components (Defined outside App to prevent re-renders) ---

const HowToUse = () => (
    <div className="w-full max-w-lg text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-slate-700 mb-4">간단 사용방법</h2>
      <div className="flex flex-col sm:flex-row justify-around items-start sm:items-center gap-4">
        {/* Step 1 */}
        <div className="flex sm:flex-col items-center text-left sm:text-center flex-1">
          <div className="bg-purple-200 p-3 rounded-full mb-0 sm:mb-2 mr-4 sm:mr-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">1. 이미지 업로드</h3>
            <p className="text-sm text-slate-600">얼굴이 잘 보이는 사진을 올려주세요.</p>
          </div>
        </div>
  
        {/* Step 2 */}
        <div className="flex sm:flex-col items-center text-left sm:text-center flex-1">
          <div className="bg-pink-200 p-3 rounded-full mb-0 sm:mb-2 mr-4 sm:mr-0">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m12.728 0l-1.414 1.414M5.636 18.364l-1.414 1.414M12 16a4 4 0 110-8 4 4 0 010 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">2. 생성 매수 선택</h3>
            <p className="text-sm text-slate-600">원하는 변환 이미지 개수를 선택하세요.</p>
          </div>
        </div>
  
        {/* Step 3 */}
        <div className="flex sm:flex-col items-center text-left sm:text-center flex-1">
          <div className="bg-blue-200 p-3 rounded-full mb-0 sm:mb-2 mr-4 sm:mr-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">3. 만들기 클릭!</h3>
            <p className="text-sm text-slate-600">AI가 새로운 이미지를 만들어요.</p>
          </div>
        </div>
      </div>
    </div>
  );

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, selectedFile }) => {
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => e.preventDefault();
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div className="w-full">
      <label 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-col justify-center items-center w-full h-40 px-4 transition bg-white/50 border-2 border-dashed rounded-xl appearance-none cursor-pointer hover:border-purple-400 focus:outline-none">
        <span className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
           <span className="font-medium text-slate-600">
             {selectedFile ? selectedFile.name : '이곳에 파일을 드롭하거나 클릭하세요'}
          </span>
        </span>
         <span className="text-sm text-slate-500 mt-1"> (JPG, PNG / 최대 {MAX_FILE_SIZE_MB}MB)</span>
      </label>
        <input type="file" name="file_upload" className="hidden" accept="image/jpeg, image/png" onChange={handleChange} />
    </div>
  );
};

interface LoadingIndicatorProps {
  progress: number;
  total: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ progress, total }) => {
    const completed = Math.round((progress / 100) * total);
    return (
        <div className="w-full max-w-md text-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
            <p className="mt-6 text-xl font-semibold text-slate-700">바나나 파워로 생성 중...🍌</p>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="mt-2 font-medium text-slate-600">{completed} / {total} 완료</p>
        </div>
    );
};

interface ImageGridProps {
    images: GeneratedImage[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {images.map(image => (
            <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg">
                <img src={image.src} alt={image.angleName} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-center p-2 font-semibold text-sm">
                    {image.angleName}
                </div>
            </div>
        ))}
    </div>
);


// --- Main App Component ---

export default function App() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imageCount, setImageCount] = useState<number>(MIN_IMAGES);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (file: File | null) => {
    setError(null);
    if(file){
        if(!['image/jpeg', 'image/png'].includes(file.type)){
            setError('JPG 또는 PNG 파일만 업로드할 수 있습니다.');
            return;
        }
        if(file.size > MAX_FILE_SIZE_MB * 1024 * 1024){
            setError(`파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.`);
            return;
        }
    }
    setSourceFile(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!sourceFile) {
      setError('이미지 파일을 먼저 업로드해주세요.');
      return;
    }
    if (imageCount < MIN_IMAGES || imageCount > MAX_IMAGES) {
      setError(`생성 매수는 ${MIN_IMAGES}에서 ${MAX_IMAGES} 사이여야 합니다.`);
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
      
      const wrappedPromises = generationPromises.map(p => p.then(result => {
        completedCount++;
        setProgress(Math.round((completedCount / totalCount) * 100));
        return result;
      }));

      const results = await Promise.all(wrappedPromises);
      setGeneratedImages(results);

    } catch (err) {
      console.error(err);
      setError('생성에 실패했습니다. 다시 시도해주세요.');
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
    <div className="min-h-screen text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <header className="text-center w-full max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">나노바나나🍌 러브!</h1>
          <p className="text-lg text-slate-600 mt-2">AI 모델로 새로운 샷 만들기</p>
           <div className="mt-4 text-slate-700 bg-white/40 backdrop-blur-sm p-4 rounded-xl shadow-md">
            <p className="text-sm sm:text-base">
              안녕하세요! 👋 나노바나나는 여러분의 사진 한 장을 AI로 분석해 다양한 구도와 표정의 새로운 이미지로 만들어 드립니다.
              <br />
              제작문의 : AICLAB 김진수소장
            </p>
          </div>
        </header>

        {isLoading ? (
          <LoadingIndicator progress={progress} total={imageCount}/>
        ) : (
          <>
            {generatedImages.length === 0 && (
                 <>
                    <HowToUse />
                    <div className="w-full max-w-lg flex flex-col items-center gap-6 p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-xl">
                        <div className="w-full">
                            <label className="font-semibold block mb-2 text-left">① 이미지 업로드</label>
                            <FileUpload onFileChange={handleFileChange} selectedFile={sourceFile} />
                        </div>
                        
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-2">
                               <label htmlFor="image-count" className="font-semibold">② 생성 매수</label>
                               <span className="font-bold text-lg text-purple-600 px-3 py-1 bg-purple-100 rounded-full">{imageCount}장</span>
                            </div>
                            <input
                            id="image-count"
                            type="range"
                            value={imageCount}
                            onChange={(e) => setImageCount(parseInt(e.target.value, 10))}
                            min={MIN_IMAGES}
                            max={MAX_IMAGES}
                            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                        
                        {error && <p className="text-red-600 font-semibold text-center py-2">{error}</p>}

                        <button
                            onClick={handleGenerate}
                            disabled={!sourceFile}
                            className="w-full bg-purple-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            나노바나나로 만들기!🍌
                        </button>
                    </div>
                 </>
            )}
           
            {generatedImages.length > 0 && (
                <div className="w-full flex flex-col items-center gap-6">
                    <ImageGrid images={generatedImages} />
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                        <button onClick={handleDownloadAll} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                            일괄 다운로드
                        </button>
                         <button onClick={() => { setGeneratedImages([]); setSourceFile(null); }} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                            새로 만들기
                        </button>
                    </div>
                </div>
            )}
          </>
        )}
      </main>
      <footer className="w-full text-center text-slate-600 text-sm mt-12 pb-4">
        <p>Powered by AICLAB &amp; Google Gemini</p>
      </footer>
    </div>
  );
}