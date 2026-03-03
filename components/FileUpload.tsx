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
